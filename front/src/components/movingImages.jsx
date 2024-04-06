import * as React from "react";
import ImageListItem from "@mui/material/ImageListItem";

function MovingImages({ movingData, setLoadedImgs }) {
  return (
    <ImageListItem key={movingData}>
      <img
        onLoad={() => setLoadedImgs((prevCount) => prevCount + 1)}
        src={`images/HomeImages/${movingData}?w=248&fit=crop&auto=format`}
        srcSet={`images/HomeImages/${movingData}?w=248&fit=crop&auto=format&dpr=6 2x`}
        alt={movingData}
        loading="lazy"
      />
    </ImageListItem>
  );
}

export default MovingImages;
