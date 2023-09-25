import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function ImgBackdrop(props) {
  const { country, imageArray, description, header } = props;
  const [open, setOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0); // Track current image index

  const checkIsClosed = () => {
    const data = true;
    props.checkIsClosed(data);
  };

  const handleClose = () => {
    setOpen(false);
    checkIsClosed();
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handlePrev = (event) => {
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (event) => {
    event.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "rgba(0, 0, 0, 0.7)",
      }}
      open={open}
      onClick={handleClose}
    >
      <Card sx={{ margin: 2, display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {header}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              component="div"
            >
              {description}
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 800 }}
          image={`/images/countriesImg/${country.toLowerCase()}/${
            imageArray[currentIndex]
          }`}
          alt={country}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            top: "90%",
            transform: "translateX(-50%)",
            display: "flex",
          }}
        >
          <Button onClick={handleClose}>close</Button>
        </Box>
        {imageArray.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              top: "90%",
              transform: "translateX(-50%)",
              display: "flex",
            }}
          >
            <Button onClick={handlePrev}>
              <NavigateBefore />
            </Button>
            <Button onClick={handleClose}>close</Button>
            <Button onClick={handleNext}>
              <NavigateNext />
            </Button>
          </Box>
        )}
      </Card>
    </Backdrop>
  );
}
