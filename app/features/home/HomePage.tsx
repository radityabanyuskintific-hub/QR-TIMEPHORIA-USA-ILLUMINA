"use client";

/* Existing product assets use CSS-driven image crops. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import VirtualLipTryOn from "../../components/VirtualLipTryOn";
import ProductCard from "../catalog/ProductCard";
import { products } from "../catalog/products";
import type { Product } from "../catalog/types";
import { tryOnPresets } from "../try-on/try-on-presets";

const copy = {
  appLabel: "Illumina Eyeshadow Stick",
  brandDescription: "Desarrollado con tecnología avanzada en un universo de belleza inspirado en el futuro, a partir de materiales informativos de Timephoria.",
  brandLabel: "Historia de la marca Timephoria",
  brandTagline: "Belleza sin límites",
  loading: "CARGANDO...",
};

export default function Home() {
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const closeTryOn = useCallback(() => setActiveTryOnProduct(null), []);
  useEffect(() => {
    let cancelled = false;
    const images = products.map(({ image: src }) => {
      const image = new Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    });
    const finishLoading = () => {
      if (!cancelled) setLoading(false);
    };
    // A failed or stalled image must not keep shoppers behind the loading screen.
    const timeout = window.setTimeout(finishLoading, 5000);
    void Promise.all(images).then(() => {
      window.clearTimeout(timeout);
      finishLoading();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <main className="site-shell product-edit" aria-busy={loading}>
      {loading ? (
        <div className="loading-screen" role="status" aria-live="polite">
          <div className="loading-content">
            <img className="loading-logo" src="/brand/timephoria-logo.png" alt="Timephoria" />
            <div className="loading-bar" aria-hidden="true"><span /></div>
            <p>{copy.loading}</p>
          </div>
        </div>
      ) : null}

      <section className="brand-panel" aria-label={copy.brandLabel} inert={loading}>
        <h1>TIMEPHORIA</h1>
        <span>{copy.brandTagline}</span>
        <p>{copy.brandDescription}</p>
      </section>

      <section className="phone-frame products" aria-label={copy.appLabel} inert={loading}>
        <div className="space-background" />
        {activeTryOnProduct ? (
          <VirtualLipTryOn
            onClose={closeTryOn}
            preset={tryOnPresets[activeTryOnProduct.name]}
            productFinish={activeTryOnProduct.finish}
            productImage={activeTryOnProduct.image}
            productDisplayName={activeTryOnProduct.shortName}
            productName={activeTryOnProduct.name}
          />
        ) : null}
        <div className="products-screen" inert={Boolean(activeTryOnProduct)}>
          <header className="catalog-toolbar">
            <img src="/brand/timephoria-logo.png" alt="Timephoria" />
          </header>
          <div className="product-list">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                onTryOn={setActiveTryOnProduct}
                product={product}
                swatchSlides={product.swatchSlides ?? []}
                thumbnail={product.image}
              />
            ))}
          </div>
        </div>

        <footer className="mobile-footer" inert={Boolean(activeTryOnProduct)}>
          <img className="footer-logo" src="/brand/timephoria-logo.png" alt="Timephoria" />
        </footer>
      </section>
    </main>
  );
}
