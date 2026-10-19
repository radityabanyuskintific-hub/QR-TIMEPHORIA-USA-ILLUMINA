import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type EyePoint = { x: number; y: number };
export type EyeDefinition = { upper: number[]; lower: number[]; brow: number[] };

export const EYES: EyeDefinition[] = [
  {
    upper: [33, 246, 161, 160, 159, 158, 157, 173, 133],
    lower: [133, 155, 154, 153, 145, 144, 163, 7, 33],
    brow: [46, 53, 52, 65, 55],
  },
  {
    upper: [263, 466, 388, 387, 386, 385, 384, 398, 362],
    lower: [362, 382, 381, 380, 374, 373, 390, 249, 263],
    brow: [276, 283, 282, 295, 285],
  },
];

export function eyelidGeometry(points: NormalizedLandmark[], eye: EyeDefinition, width: number, height: number) {
  const indices = [...eye.upper, ...eye.lower, ...eye.brow];
  if (indices.some(index => !points[index] || !Number.isFinite(points[index].x) || !Number.isFinite(points[index].y))) return null;
  const pixel = (index: number) => ({ x: points[index].x * width, y: points[index].y * height });
  const origin = pixel(eye.upper[0]);
  const end = pixel(eye.upper[eye.upper.length - 1]);
  const span = Math.hypot(end.x - origin.x, end.y - origin.y);
  if (span < 6) return null;
  const axis = { x: (end.x - origin.x) / span, y: (end.y - origin.y) / span };
  const normal = { x: -axis.y, y: axis.x };
  const browPixels = eye.brow.map(pixel);
  const browDirection = browPixels.reduce((sum, p) => sum + (p.x - origin.x) * normal.x + (p.y - origin.y) * normal.y, 0);
  if (browDirection < 0) { normal.x *= -1; normal.y *= -1; }
  const local = (index: number): EyePoint => {
    const p = pixel(index);
    return {
      x: ((p.x - origin.x) * axis.x + (p.y - origin.y) * axis.y) / span,
      y: ((p.x - origin.x) * normal.x + (p.y - origin.y) * normal.y) / span,
    };
  };
  const lid = eye.upper.map(local);
  const brow = eye.brow.map(local);
  const top = lid.map(p => {
    const nearestBrow = brow.reduce((nearest, candidate) => Math.abs(candidate.x - p.x) < Math.abs(nearest.x - p.x) ? candidate : nearest);
    const gap = Math.max(0, nearestBrow.y - p.y);
    const taper = Math.sin(Math.PI * Math.min(1, Math.max(0, p.x))) ** 0.8;
    // Reserve most of the lid-to-brow gap, including on hooded eyes.
    const lift = Math.min(0.13, gap * 0.38) * taper * (1.08 - p.x * 0.22);
    return { x: p.x, y: p.y + lift };
  });
  return { origin, axis, normal, span, lid, top, aperture: [...lid, ...eye.lower.map(local)] };
}

export type EyelidGeometry = NonNullable<ReturnType<typeof eyelidGeometry>>;
