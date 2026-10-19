import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { EYES, eyelidGeometry, type EyePoint } from "./eyeshadow-geometry.ts";

function curve(context: CanvasRenderingContext2D, points: EyePoint[], move: boolean) {
  if (move) context.moveTo(points[0].x, points[0].y);
  else context.lineTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const next = points[i + 1];
    context.quadraticCurveTo(p.x, p.y, (p.x + next.x) / 2, (p.y + next.y) / 2);
  }
  const last = points[points.length - 1];
  context.lineTo(last.x, last.y);
}

export function createEyeshadowRenderer() {
  const mask = document.createElement("canvas");
  const pigment = document.createElement("canvas");
  return {
    draw(context: CanvasRenderingContext2D, points: NormalizedLandmark[], width: number, height: number, color: string, intensity: number, shimmer: boolean) {
      for (const eye of EYES) {
        const geometry = eyelidGeometry(points, eye, width, height);
        if (!geometry) continue;
        const { origin, axis, normal, span, lid, top, brow, aperture } = geometry;
        const padding = Math.ceil(span * 0.12);
        const maxY = Math.max(...top.map(p => p.y), 0.2);
        const bufferWidth = Math.ceil(span + padding * 2);
        const bufferHeight = Math.ceil(span * (maxY + 0.2) + padding * 2);
        if (mask.width !== bufferWidth || mask.height !== bufferHeight) {
          mask.width = pigment.width = bufferWidth;
          mask.height = pigment.height = bufferHeight;
        }
        const m = mask.getContext("2d");
        const p = pigment.getContext("2d");
        if (!m || !p) continue;
        const baseline = bufferHeight - padding - span * 0.15;
        m.resetTransform();
        m.clearRect(0, 0, bufferWidth, bufferHeight);
        m.save();
        m.setTransform(span, 0, 0, -span, padding, baseline);
        m.filter = `blur(${Math.max(0.8, span * 0.025)}px)`;
        const edgeFade = m.createLinearGradient(0, maxY, 0, 0);
        edgeFade.addColorStop(0, "rgba(255,255,255,0.2)");
        edgeFade.addColorStop(0.32, "rgba(255,255,255,0.85)");
        edgeFade.addColorStop(0.7, "#fff");
        edgeFade.addColorStop(1, "#fff");
        m.fillStyle = edgeFade;
        m.beginPath();
        curve(m, lid, true);
        curve(m, [...top].reverse(), false);
        m.closePath();
        m.fill();
        m.filter = "none";
        // Remove the eye opening after feathering so tint and shimmer cannot blur onto it.
        m.globalCompositeOperation = "destination-out";
        m.beginPath();
        curve(m, aperture, true);
        m.closePath();
        m.fill();
        m.lineWidth = 0.012;
        m.lineJoin = "round";
        m.strokeStyle = "#fff";
        m.stroke();
        // Feathering must not cross onto low brows when the lid wash gets wider.
        const browEdge = brow.map(p => ({ x: p.x, y: p.y - 0.035 })).sort((a, b) => a.x - b.x);
        m.fillStyle = "#fff";
        m.beginPath();
        m.moveTo(-1, 2);
        m.lineTo(-1, browEdge[0].y);
        curve(m, browEdge, false);
        m.lineTo(2, browEdge[browEdge.length - 1].y);
        m.lineTo(2, 2);
        m.closePath();
        m.fill();
        m.restore();

        p.resetTransform();
        p.clearRect(0, 0, bufferWidth, bufferHeight);
        p.save();
        const opacity = Math.min(0.43, 0.1 + intensity * 0.54);
        p.globalAlpha = opacity;
        p.filter = "saturate(1.15)";
        p.fillStyle = color;
        p.fillRect(0, 0, bufferWidth, bufferHeight);
        p.filter = "none";
        if (shimmer) {
          const sheen = p.createRadialGradient(padding + span * 0.48, baseline - span * 0.15, 0, padding + span * 0.48, baseline - span * 0.15, span * 0.42);
          sheen.addColorStop(0, "rgba(255,244,228,0.38)");
          sheen.addColorStop(1, "rgba(255,244,228,0)");
          p.fillStyle = sheen;
          p.fillRect(0, 0, bufferWidth, bufferHeight);
          p.globalAlpha = Math.min(0.23, intensity * 0.35);
          p.fillStyle = "#fff5e9";
          // Stable fine grains replace flashing dots; the mask clips every grain to the lid.
          for (let i = 0; i < 75; i++) {
            const x = padding + ((i * 37) % 101) / 101 * span;
            const y = baseline - ((i * 53) % 97) / 97 * span * maxY;
            p.fillRect(x, y, Math.max(0.45, span * 0.004), Math.max(0.45, span * 0.004));
          }
        }
        p.globalAlpha = 1;
        p.globalCompositeOperation = "destination-in";
        p.drawImage(mask, 0, 0);
        p.restore();

        context.save();
        context.translate(origin.x, origin.y);
        context.transform(axis.x, axis.y, -normal.x, -normal.y, 0, 0);
        context.globalCompositeOperation = "source-over";
        context.drawImage(pigment, -padding, -baseline);
        context.restore();
      }
    },
  };
}
