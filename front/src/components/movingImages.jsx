import * as React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

function MovingImages({ movingData }) {
  /* const imageArray = img_name.split(",");
  const mainImage = imageArray.find((imageName) =>
    imageName.includes("MI.jpg")
  ); */

  //capitalizing and removing .jpg for title
  console.log(movingData);
  const firstWord = movingData.slice(0, 1);
  const firstCapital = firstWord.toUpperCase();
  const noFirstWord = movingData.slice(1);
  const forTitle = firstCapital + noFirstWord;
  const noJpg = forTitle.split(".jpg", 1);

  return (
    <ImageListItem key={movingData}>
      <img
        src={`images/HomeImages/${movingData}?w=248&fit=crop&auto=format`}
        srcSet={`images/HomeImages/${movingData}?w=248&fit=crop&auto=format&dpr=6 2x`}
        alt={movingData}
        loading="lazy"
      />

      <ImageListItemBar position="bottom" title={noJpg} />
    </ImageListItem>
  );
}

export default MovingImages;
