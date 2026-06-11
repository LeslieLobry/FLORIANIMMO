"use client";

import { useState } from "react";

export default function PropertyGallery({ images = [] }) {
  const [activeImage, setActiveImage] = useState(images[0]?.url || null);

  if (!images.length) {
    return (
      <div className="property-main-photo property-image-empty">
        Aucune image
      </div>
    );
  }

  return (
    <div className="property-gallery-wrapper">
      <div
        className="property-main-photo"
        style={{ backgroundImage: `url('${activeImage}')` }}
      />

      {images.length > 1 && (
        <div className="property-thumbs">
          {images.map((image) => (
            <button
              type="button"
              key={image.id}
              className={`property-thumb-btn ${
                activeImage === image.url ? "active" : ""
              }`}
              onClick={() => setActiveImage(image.url)}
            >
              <span
                className="property-thumb"
                style={{ backgroundImage: `url('${image.url}')` }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}