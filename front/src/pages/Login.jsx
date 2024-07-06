import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthModal from "../components/modals/authModal";
import { setAuth, setUsers } from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login({ url }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastLogMessage, setLastLogMessage] = useState("");

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${url}/api/isLogged`);
      if (res.data.success === true) {
        const { name, mail, id, isAdmin } = res.data;
        dispatch(setAuth(true));
        dispatch(setUsers({ name, mail, id, isAdmin }));
      } else {
        dispatch(setAuth(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setAuth(false));
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${url}/api/login`, {
        email: data.email,
        password: data.password,
      });
      checkAuth();
      toast.success("Login successful! Welcome back!", {
        position: "bottom-left",
      });

      setShowModal(true);
      setLastLogMessage(response.data.lastLog);
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      if (error.response?.status === 401) {
        const { error: errMessage } = error.response.data;
        setErrorMessage(errMessage);
      }
    }
  };

  const auth = useSelector((state) => state.auth.isAuthenticated);
  const name = useSelector((state) => state.auth.name);
  const mail = useSelector((state) => state.auth.mail);
  const id = useSelector((state) => state.auth.id);

  return (
    <>
      {showModal && (
        <AuthModal
          lastLogin={lastLogMessage}
          message={`✈️${name} Welcome to ZIPTRIP. `}
        />
      )}
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(images/travel-login.avif)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#c5aa6a" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  {...register("email")}
                />
                <Typography component="span" variant="body1">
                  {errors.email?.message}
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <Typography component="span" variant="body1">
                  {errors.password?.message}
                  {errorMessage}
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: " #302F2C",
                    "&:hover": {
                      backgroundColor: "#CAC4B0",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link to="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
