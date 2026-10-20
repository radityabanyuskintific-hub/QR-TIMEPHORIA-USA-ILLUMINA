import { illuminaShades } from "./illumina-shades.ts";
import type { Product } from "./types";

const productDetails: Omit<Product, "shades">[] = [
  {
    name: "ILLUMINA EYESHADOW STICK",
    shortName: "ILLUMINA EYESHADOW STICK",
    category: "eyes",
    finish: "EYE GAME STRONG",
    price: "IDR 00.000",
    size: "Sombra en barra",
    image: "/product-pages/thumbnail-card/thumbnail-card-illumina.jpg",
    description: "Sombra de ojos en barra con textura gelatinosa, destellos intensos y ligeros, brillo metálico, sensación fresca y acabado sin pliegues.",
    claims: ["Textura gelatinosa", "Alta pigmentación", "Brillo duradero"],
    swatchSlides: [
      "/swatches/swatches-eye/swatches-illumina/swatches-illumina-1.jpg",
    ],
  },
];

export const products: Product[] = productDetails.map((product) => ({
  ...product,
  shades: illuminaShades.map(({ code, name }) => `${code} ${name}`),
}));
