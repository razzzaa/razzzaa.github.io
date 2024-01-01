require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const salt = 10;
const verifyUser = require("./authServer");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const port = 3030;

app.use(
  cors({
    origin: ["https://travelreact.onrender.com", "http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const conn = mysql.createConnection({
  // PRODUCTION MYSQL
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  //LOCAL
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "travel",
  port: 3306,
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected succesefully to mySQL!");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { country, destination } = req.body;
    const folderPath = `../front/public/images/countriesImg/${country.toLowerCase()}`;

    fs.mkdirSync(folderPath, { recursive: true });

    return cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const modifiedFilename = `${file.originalname}MI${path.extname(
      file.originalname
    )}`;

    return cb(null, `${modifiedFilename}`);
  },
});

const upload = multer({ storage });

app.get("/api/data", (req, res) => {
  const { page } = req.query;

  const itemsPerPage = 8;
  const offset = (page - 1) * itemsPerPage;
  conn.query(
    `SELECT * FROM vocations LIMIT ${itemsPerPage} OFFSET ${offset}`,
    (err, result) => {
      if (err) {
        res.status(400).json({ success: false, message: err, data: result });
      } else {
        res
          .status(200)
          .json({ data: result, message: "Data was sent successfuly" });
      }
    }
  );
});

/* app.get("/api/wishlist", verifyUser, (req, res) => {
  res.json({ success: true, name: req.name });
});

app.get("/api/statistics", verifyUser, (req, res) => {
  res.json({ success: true, name: req.name });
}); */

app.get("/", (req, res) => {
  conn.query(`SELECT * FROM vocations`, (err, result) => {
    if (err) {
      res.status(400).json({ success: false, message: err, data: result });
    } else {
      res
        .status(200)
        .json({ data: result, message: "Data was sent successfuly" });
    }
  });
});

app.get("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.status(200).json({ success: true });
});

app.post("/api/register", (req, res) => {
  const { firstName, email, password } = req.body;
  bcrypt.hash(password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error while hashing password" });
    conn.query(
      `INSERT INTO users (name, email, password) VALUES (?,?,?)`,
      [firstName, email, hash],
      (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ success: false, message: "Registration failed." });
        } else {
          res
            .status(200)
            .json({ success: true, message: "Registration successful." });
        }
      }
    );
  });
});

app.post("/api/checkEmail", (req, res) => {
  const { email } = req.body;
  conn.query(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: "Internal Server Error" });
      } else if (result.length > 0) {
        res.status(409).send({
          isEmailAlreadyInUse: true,
        });
      } else {
        res.status(200).send({ isEmailAlreadyInUse: false });
      }
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  let lastLogin = null;
  conn.query(`SELECT * FROM users WHERE email =?`, [email], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
    if (result.length > 0) {
      bcrypt.compare(
        password.toString(),
        result[0].password,
        (err, response) => {
          if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
          }
          if (response) {
            console.log(result);
            console.log(response);
            const name = result[0].name;
            const mail = result[0].email;
            const id = result[0].id;
            const isAdmin = result[0].isAdmin;

            if (result[0].last_login === null) {
              lastLogin =
                "This is your first time logging in. Enjoy your journey!";
            } else {
              const lastLoginTimestamp = new Date(result[0].last_login);

              lastLoginTimestamp.setHours(lastLoginTimestamp.getHours() + 3);

              const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "Asia/Jerusalem",
              };

              const lastLoginFormatter = new Intl.DateTimeFormat(
                "he-IL",
                options
              );
              lastLogin = `Last time you were logged-in:${lastLoginFormatter.format(
                lastLoginTimestamp
              )}`;
            }

            const token = jwt.sign(
              { name, mail, id, isAdmin },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );
            const refreshToken = jwt.sign(
              { name, mail, id, isAdmin },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: "1d",
              }
            );

            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });

            res.status(200).json({
              success: true,
              message: "Logged in successful.",
              name: name,
              lastLog: lastLogin,
            });

            const lastLoginTimestamp = new Date().toISOString();
            conn.query(
              `UPDATE users SET last_login = ? WHERE email = ?`,
              [lastLoginTimestamp, email],
              (err, lastLog) => {
                if (err) {
                  console.log(err);
                }
                console.log(lastLog);
              }
            );
          } else {
            res
              .status(401)
              .json({ error: "wrong username/password combination" });
          }
        }
      );
    } else {
      res.status(401).json({ error: "wrong username/password combination" });
    }
  });
});

app.post("/api/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json("Access Denied. No refresh token provided.");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = jwt.sign(decoded.name, process.env.ACCESS_TOKEN_SECRET);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ name: decoded.name });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/isLogged", verifyUser, (req, res) => {
  res.status(200).json({
    success: true,
    name: req.name,
    mail: req.mail,
    id: req.id,
    isAdmin: req.isAdmin,
  });
});

app.post("/api/like", (req, res) => {
  const { vocation_id, user_id } = req.body;

  conn.query(
    `INSERT INTO followers(vocation_id, user_id) VALUES (?, ?)`,
    [vocation_id, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Failed to like/follow the vocation.",
        });
      }

      conn.query(
        `UPDATE vocations SET followers_count = followers_count + 1 WHERE id = ?`,
        [vocation_id],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              message: "Failed to update followers_count.",
            });
          }

          console.log(result);
          return res.status(200).json({
            success: true,
            message: "Vocation liked/followed successfully.",
          });
        }
      );
    }
  );
});

app.post("/api/unlike", (req, res) => {
  const { vocation_id, user_id } = req.body;
  conn.query(
    `DELETE FROM followers WHERE vocation_id = ? AND user_id =?`,
    [vocation_id, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Failed to unfollow the vocation",
        });
      } else {
        conn.query(
          `UPDATE vocations SET followers_count = followers_count -1 WHERE id =?`,
          [vocation_id],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Failed to update followers_count",
              });
            } else {
              console.log(result);
              return res.status(200).json({
                success: true,
                message: "Vocation unfollowed successfully",
              });
            }
          }
        );
      }
    }
  );
});

app.get("/api/getFollowers", (req, res) => {
  const { user_id } = req.query;
  conn.query(
    `SELECT * FROM followers WHERE user_id = ?`,
    [user_id],
    (err, result) => {
      console.log(err);
      if (err) {
        res
          .status(500)
          .json({ success: false, message: "Failed to Select followers" });
      } else {
        console.log(result);

        res.status(200).json({
          success: true,
          message: "Followers Selected Successfully",
          data: result,
        });
      }
    }
  );
});

app.delete("/api/deleteVocation/:id", (req, res) => {
  const { id } = req.params;
  conn.query(`DELETE FROM vocations WHERE id =? `, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Failed to DELETE the vocation",
      });
    } else {
      console.log(result);
      return res.status(200).json({
        success: true,
        message: "Vocation DELETED successfully",
      });
    }
  });
});

app.post("/api/uploadCards", upload.any(), (req, res) => {
  const imgNames = req.files.map((file) => file.filename);
  console.log(imgNames);
  const { destination, country, header, description, days, date, price } =
    req.body;
  const inputDate = new Date(date);
  const goodDate = inputDate.toISOString().split("T")[0];
  const imgNameString = imgNames.join(",");
  console.log(imgNames);
  console.log(imgNameString);

  conn.query(
    `INSERT INTO vocations (destination, country, header, description, days, next_departure, price, img_name)
       VALUES (?,?,?,?,?,?,?,?)`,
    [
      destination,
      country,
      header,
      description,
      days,
      goodDate,
      price,
      imgNameString,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Upload failed." });
      } else {
        console.log("Upload successful.");
        res.status(200).json({ success: true, message: "Upload successful." });
      }
    }
  );
});

app.put("/api/updateCards", upload.single("img"), (req, res) => {
  const newImageName = req.file ? req.file.filename : null;
  console.log(newImageName);

  const {
    id,
    mainImg,
    country,
    destination,
    header,
    description,
    days,
    date,
    price,
    oldFolderName,
  } = req.body;

  if (newImageName) {
    conn.query(
      `SELECT img_name FROM vocations WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.error("Error fetching existing image names:", err);
          res.status(500).json({ message: "Failed to update image name" });
        } else {
          const existingImageNames = result[0].img_name.split(",");
          const updatedImageNames = existingImageNames.map((imageName) =>
            imageName === mainImg ? newImageName : imageName
          );
          const updatedImageNamesStr = updatedImageNames.join(",");

          conn.query(
            `UPDATE vocations SET img_name = ? WHERE id = ?`,
            [updatedImageNamesStr, id],
            (err, result) => {
              if (err) {
                console.error("Error updating image name:", err);
                res
                  .status(500)
                  .json({ message: "Failed to update image name" });
              } else {
                console.log("Image name updated successfully");

                if (mainImg) {
                  const mainImagePath = `../front/public/images/countriesImg/${country}/${mainImg}`;
                  fs.unlink(mainImagePath, (err) => {
                    if (err) {
                      console.error("Error deleting old main image:", err);
                    } else {
                      console.log("Old main image deleted successfully");
                    }
                  });
                }

                // Send the response here after all operations are done
                res
                  .status(200)
                  .json({ message: "Image name updated successfully" });
              }
            }
          );
        }
      }
    );
  } else {
    if (country !== oldFolderName) {
      const newFolderPath = `../front/public/images/countriesImg/${country.toLowerCase()}`;
      const oldFolderPath = `../front/public/images/countriesImg/${oldFolderName.toLowerCase()}`;
      fs.rename(oldFolderPath, newFolderPath, (err) => {
        if (err) {
          console.error("Error renaming folder:", err);
        } else {
          console.log("Folder renamed successfully");
        }
      });
    }

    const inputDate = new Date(date);
    conn.query(
      `UPDATE vocations SET destination = ?, country = ?, ` +
        `header = ?, description = ?, days = ?, next_departure = ?, price = ? ` +
        `WHERE id = ?`,
      [destination, country, header, description, days, inputDate, price, id],
      (err, result) => {
        if (err) {
          console.error("Error updating data:", err);
          res.status(500).json({ message: "Failed to update data" });
        } else {
          console.log("Data updated successfully");

          // Send the response here after all operations are done
          res.status(200).json({ message: "Data updated successfully" });
        }
      }
    );
  }
});

app.get("/api/getCount", (req, res) => {
  const query =
    "SELECT country, SUM(followers_count) AS total_followers_count FROM vocations GROUP BY country";

  conn.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(
  process.env.PORT,
  console.log(`listening to port ${process.env.PORT}!`)
);
