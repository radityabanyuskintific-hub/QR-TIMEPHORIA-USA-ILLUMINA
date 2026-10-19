import { illuminaShades } from "./illumina-shades.ts";
import type { Product } from "./types";

const productDetails: Omit<Product, "shades">[] = [
  {
    name: "ILLUMINA EYESHADOW STICK",
    shortName: "ILLUMINA EYESHADOW STICK",
    category: "eyes",
    finish: "EYE GAME STRONG",
    price: "IDR 00.000",
    size: "Eyeshadow stick",
    image: "/product-pages/thumbnail-card/thumbnail-card-illumina.jpg",
    description: "Jelly eyeshadow stick with lightweight high-impact sparkle, hydra-metallic shine, cool cushion feel, and crease-free wear.",
    claims: ["Jelly texture", "High pigment", "Long-lasting shine"],
    swatchSlides: [
      "/swatches/swatches-eye/swatches-illumina/swatches-illumina-1.jpg",
    ],
  },
];

export const products: Product[] = productDetails.map((product) => ({
  ...product,
  shades: illuminaShades.map(({ code, name }) => `${code} ${name}`),
}));
