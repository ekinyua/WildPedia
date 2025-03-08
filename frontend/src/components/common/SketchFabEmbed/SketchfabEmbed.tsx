import React from "react";

const SketchfabEmbed = () => {
  return (
    <div
      className="sketchfab-embed-wrapper"
      style={{ width: "100%", height: "600px" }}
    >
      <iframe
        title="Tyrannosaurus Rex 2015-2018"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        web-share
        src="https://sketchfab.com/models/fb05d023393a4e9eac42c34b3b5cce75/embed"
        style={{ width: "100%", height: "100%" }}
      ></iframe>
      <p
        style={{
          fontSize: "13px",
          fontWeight: "normal",
          margin: "5px",
          color: "#4A4A4A",
        }}
      >
        <a
          href="https://sketchfab.com/3d-models/tyrannosaurus-rex-2015-2018-fb05d023393a4e9eac42c34b3b5cce75?utm_medium=embed&utm_campaign=share-popup&utm_content=fb05d023393a4e9eac42c34b3b5cce75"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Tyrannosaurus Rex 2015-2018
        </a>{" "}
        by{" "}
        <a
          href="https://sketchfab.com/GodzillaModels?utm_medium=embed&utm_campaign=share-popup&utm_content=fb05d023393a4e9eac42c34b3b5cce75"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Allthingssaurus
        </a>{" "}
        on{" "}
        <a
          href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=fb05d023393a4e9eac42c34b3b5cce75"
          target="_blank"
          rel="nofollow noreferrer"
          style={{ fontWeight: "bold", color: "#1CAAD9" }}
        >
          Sketchfab
        </a>
      </p>
    </div>
  );
};

export default SketchfabEmbed;
