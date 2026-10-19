import type { LipTryOnShade } from "../../lip-try-on-shades.ts";
import { illuminaShades } from "../catalog/illumina-shades.ts";

export type TryOnRegion =
  | "brows" | "concealer" | "contour" | "eyeliner" | "eyelashes"
  | "eyeshadow" | "foundation" | "lips" | "blush";

export type TryOnPreset = {
  coverage?: number;
  finish?: "glow" | "matte" | "natural" | "satin";
  region: TryOnRegion;
  shades: LipTryOnShade[];
  shimmer?: boolean;
};

export const tryOnPresets: Record<string, TryOnPreset> = {
  "ILLUMINA EYESHADOW STICK": {
    region: "eyeshadow",
    shimmer: true,
    shades: illuminaShades,
  },
};
