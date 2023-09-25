import * as React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

function MovingImages(props) {
  const { country, img_name } = props.movingData;
  const imageArray = img_name.split(",");
  const mainImage = imageArray.find((imageName) =>
    imageName.includes("MI.jpg")
  );
  return (
    <ImageListItem key={country}>
      <img
        src={`/images/countriesImg/${country}/${mainImage}?w=248&fit=crop&auto=format`}
        srcSet={`/images/countriesImg/${country}/${mainImage}?w=248&fit=crop&auto=format&dpr=6 2x`}
        alt={country}
        loading="lazy"
      />
      <ImageListItemBar position="bottom" title={country} />
    </ImageListItem>
  );
}

export default MovingImages;
