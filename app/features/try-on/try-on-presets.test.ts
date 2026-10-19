import assert from "node:assert/strict";
import test from "node:test";
import { products } from "../catalog/products.ts";
import { illuminaShades } from "../catalog/illumina-shades.ts";
import { tryOnPresets } from "./try-on-presets.ts";

const expected = {
  "ILLUMINA EYESHADOW STICK": [
    ["001", "Moonshell"],
    ["002", "Blush Quartz"],
    ["003", "Zenith"],
    ["004", "Peach Pearl"],
    ["005", "Bronzite"],
    ["006", "Topaz"],
    ["007", "Rose Stone"],
    ["008", "Chromite"],
    ["009", "Diamond"],
    ["010", "Amethyst"],
  ],
};

test("catalog and try-on contain only Illumina with shimmer eyeshadow application", () => {
  assert.deepEqual(products.map(({ name }) => name), Object.keys(expected));
  assert.deepEqual(Object.keys(tryOnPresets), Object.keys(expected));
  assert.equal(products[0].category, "eyes");
  assert.equal(tryOnPresets["ILLUMINA EYESHADOW STICK"].region, "eyeshadow");
  assert.equal(tryOnPresets["ILLUMINA EYESHADOW STICK"].shimmer, true);
});

test("catalog and try-on shades match all ten names and codes printed on the Illumina chart", () => {
  for (const [productName, rows] of Object.entries(expected)) {
    const preset = tryOnPresets[productName];
    assert.deepEqual(preset.shades.map(({ code, name }) => [code, name]), rows);
    assert.ok(preset.shades.every((shade) => /^#[0-9A-F]{6}$/i.test(shade.hex)), productName);
    assert.deepEqual(products.find(({ name }) => name === productName)?.shades, rows.map(([code, name]) => `${code} ${name}`));
  }
  assert.equal(illuminaShades.length, 10);
  assert.equal(new Set(illuminaShades.map(({ code }) => code)).size, 10);
  assert.ok(illuminaShades.every(({ sku }) => sku === undefined), "Chart shades must not imply a retailer SKU mapping");
});
