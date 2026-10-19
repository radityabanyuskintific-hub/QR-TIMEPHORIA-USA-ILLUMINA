import assert from "node:assert/strict";
import test from "node:test";
import { EYES, eyelidGeometry } from "./eyeshadow-geometry.ts";

function fixture(angle = 0, scale = 1, opening = 1, browHeight = 0.34, mirrored = false) {
  const points = Array.from({ length: 478 }, () => ({ x: 0, y: 0, z: 0, visibility: 1 }));
  const eye = EYES[0];
  const put = (index: number, x: number, y: number) => {
    const u = (mirrored ? -x : x) * 100 * scale;
    const v = y * 100 * scale;
    points[index] = { x: (200 + u * Math.cos(angle) - v * Math.sin(angle)) / 600, y: (200 + u * Math.sin(angle) + v * Math.cos(angle)) / 600, z: 0, visibility: 1 };
  };
  eye.upper.forEach((index, i, values) => { const t = i / (values.length - 1); put(index, t, -0.1 * Math.sin(t * Math.PI) * opening); });
  eye.lower.forEach((index, i, values) => { const t = 1 - i / (values.length - 1); put(index, t, 0.08 * Math.sin(t * Math.PI) * opening); });
  eye.brow.forEach((index, i, values) => put(index, i / (values.length - 1), -browHeight));
  return eyelidGeometry(points, eye, 600, 600);
}

test("eyeshadow covers the lid rather than a lash-line strip, leaving the brow gap clear", () => {
  const geometry = fixture();
  assert.ok(geometry);
  const center = 4;
  const lift = geometry.top[center].y - geometry.lid[center].y;
  const gap = 0.34 - geometry.lid[center].y;
  assert.ok(lift > 0.14, "The central wash must have eyeshadow-sized coverage");
  assert.ok(lift / gap > 0.55 && lift / gap < 0.75);
  assert.ok(Math.max(...geometry.top.map(p => p.y)) < 0.3);
  assert.ok(Math.abs(geometry.top[0].y - geometry.lid[0].y) < 1e-8);
  assert.ok(Math.abs(geometry.top.at(-1)!.y - geometry.lid.at(-1)!.y) < 1e-8);
  for (let i = 0; i < geometry.lid.length; i++) {
    assert.ok(geometry.top[i].y >= geometry.lid[i].y);
    assert.ok(geometry.top[i].y < 0.34);
  }
});

test("placement follows eye rotation, scale and left/right mirroring", () => {
  const baseline = fixture()!;
  for (const angle of [-0.6, 0, 0.6]) {
    for (const scale of [0.5, 1, 2]) {
      for (const mirrored of [true, false]) {
        const geometry = fixture(angle, scale, 1, 0.34, mirrored)!;
        for (let i = 0; i < geometry.top.length; i++) {
          assert.ok(Math.abs(geometry.top[i].x - baseline.top[i].x) < 1e-8);
          assert.ok(Math.abs(geometry.top[i].y - baseline.top[i].y) < 1e-8);
        }
      }
    }
  }
});

test("a lower brow reduces coverage, and blinking never flips the mask across the lid", () => {
  const lowBrow = fixture(0, 1, 1, 0.14)!;
  assert.ok(lowBrow.top[4].y - lowBrow.lid[4].y < 0.03);
  for (const opening of [0, 0.1, 0.5, 1]) {
    const geometry = fixture(0, 1, opening)!;
    assert.ok(geometry.top.every((p, i) => p.y >= geometry.lid[i].y));
  }
});

test("missing or collapsed eye landmarks skip rendering", () => {
  assert.equal(eyelidGeometry([], EYES[0], 600, 600), null);
  assert.equal(eyelidGeometry(Array.from({ length: 478 }, () => ({ x: 0, y: 0, z: 0, visibility: 1 })), EYES[0], 600, 600), null);
});
