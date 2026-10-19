"use client";

/* Product and swatch assets rely on the existing raw-image sizing behavior. */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { Product } from "./types";

type ProductCardProps = {
  onTryOn?: (product: Product) => void;
  product: Product;
  promoLabel?: string;
  swatchSlides: string[];
  thumbnail: string;
};

const cardCopy = {
  claims: "claims",
  finishAndShades: "TAP TO SEE THE FINISH AND SHADES",
  liveCamera: "LIVE CAMERA",
  productImage: "product image",
  swatch: "Tap to see swatches",
  swatchSlides: "Swatch slides",
  swatches: "swatch",
  toneChart: "Tone chart",
  tryOn: { eyes: "TRY IT ON", face: "TRY IT ON", lips: "TRY IT ON" },
};

export default function ProductCard({
  onTryOn,
  product,
  promoLabel,
  swatchSlides,
  thumbnail,
}: ProductCardProps) {
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [activeSwatchSlide, setActiveSwatchSlide] = useState(0);
  const copy = cardCopy;

  function updateActiveSwatchSlide(target: HTMLDivElement) {
    const nextSlide = Math.round(target.scrollLeft / target.clientWidth);
    setActiveSwatchSlide(
      Math.min(Math.max(nextSlide, 0), swatchSlides.length - 1),
    );
  }

  return (
    <article className="product-card">
      {promoLabel ? <div className="promo-badge">{promoLabel}</div> : null}
      <div className="product-visual">
        <img src={thumbnail} alt={`${product.name}, ${copy.productImage}`} />
      </div>
      <div className="product-copy">
        <h3>{product.shortName}</h3>
        <p>{product.description}</p>
        <div className="claim-row" aria-label={`${product.name}, ${copy.claims}`}>
          {product.claims.slice(0, 3).map((claim) => (
            <span key={claim}>{claim}</span>
          ))}
        </div>
      </div>
      {onTryOn ? (
        <button
          className="tryon-card-action"
          onClick={() => onTryOn(product)}
          type="button"
        >
          <span>{copy.tryOn[product.category]}</span>
          <strong>{copy.liveCamera}</strong>
        </button>
      ) : null}
      <div className={`shade-panel ${isSwatchOpen ? "open" : ""}`}>
        <button
          className="shade-toggle"
          aria-expanded={isSwatchOpen}
          onClick={() => setIsSwatchOpen((open) => !open)}
          type="button"
        >
          {product.category === "lips" || product.category === "eyes" ? (
            <span>
              {copy.finishAndShades}
            </span>
          ) : (
            <>
              <span>
                {copy.swatch}
              </span>
              <strong>
                {copy.toneChart}
              </strong>
            </>
          )}
        </button>
        <div className="shade-content" inert={!isSwatchOpen}>
          <div className="shade-content-inner">
            <ul className="available-shades" aria-label={`${product.name}, ${copy.swatches}`}>
              {product.shades.map((shade) => <li key={shade}>{shade}</li>)}
            </ul>
            <div className="swatch-preview">
              <div
                className="swatch-carousel"
                onScroll={(event) =>
                  updateActiveSwatchSlide(event.currentTarget)}
              >
                {swatchSlides.map((slide, index) => (
                  <img
                    key={slide}
                    src={slide}
                    alt={`${product.name}, ${copy.swatches} ${index + 1}`}
                  />
                ))}
              </div>
              {swatchSlides.length > 1 ? (
                <div className="swatch-dots" aria-label={copy.swatchSlides}>
                  {swatchSlides.map((slide, index) => (
                    <span
                      key={slide}
                      className={index === activeSwatchSlide ? "active" : ""}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
