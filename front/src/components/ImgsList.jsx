import ImageList from "@mui/material/ImageList";
import MovingImages from "./movingImages";
import { useEffect, useState } from "react";
import Spinner from "./Spinner.jsx";
import { Box } from "@mui/material";

const mainImgs = [
  "amsterdam.jpg",
  "athens.jpg",
  "barcelona.jpg",
  "berlin.jpg",
  "budapest.jpg",
  "dubai.jpg",
  "jerusalem.jpg",
  "london.jpg",
  "newdelhi.jpg",
  "newyork.jpg",
  "paris.jpg",
  "prague.jpg",
  "RiodeJaneiro.jpg",
  "rome.jpg",
  "santorini.jpg",
  "tokyo.jpg",
];

function ImgsList({ animatedImgRef }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImgs, setLoadedImgs] = useState(0);
  const totalImages = mainImgs.length;
  console.log(totalImages);
  console.log(loadedImgs);
  console.log(isLoaded);

  useEffect(() => {
    if (loadedImgs === totalImages) setIsLoaded(true);
  }, [loadedImgs, totalImages]);

  return (
    <Box
      ref={animatedImgRef}
      sx={{
        borderRadius: 40,
        width: 600,
        height: 550,
        overflowY: "hidden",
      }}
    >
      <ImageList
        className="scrolling-animation"
        variant="masonry"
        cols={3}
        gap={8}
      >
        {mainImgs.map((items) => (
          <MovingImages
            setLoadedImgs={setLoadedImgs}
            key={items}
            movingData={items}
          />
        ))}
        {console.log("yebat")}
      </ImageList>
    </Box>
  );
}

export default ImgsList;
