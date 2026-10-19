# Timephoria Illumina

Standalone English product card and camera virtual try-on for Illumina Eyeshadow Stick, copied from the Timephoria standalone app. Uses Next.js, React, TypeScript, Tailwind CSS and the bundled MediaPipe face-tracking runtime.

## Run

Requires Node.js 22.13 or newer.

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. For a production run:

```powershell
npm run build
npm start
```

Run `npm run check` for lint, shade-data tests, type checking and a production build.

The camera works on localhost or an HTTPS host. Allow camera permission when prompted. A phone accessing a plain HTTP LAN address will require HTTPS before camera access works.

## Content

- One Illumina product card with the original artwork, description and swatch chart.
- Ten selectable shades from the original chart: 001 Moonshell, 002 Blush Quartz, 003 Zenith, 004 Peach Pearl, 005 Bronzite, 006 Topaz, 007 Rose Stone, 008 Chromite, 009 Diamond, 010 Amethyst.
- Eyeshadow application with the existing shimmer renderer.
- Eyelid contours follow each eye's rotation and scale, taper at the corners and reserve the brow gap. A feathered mask excludes the eye opening and clips the fine shimmer to the lid.
- Camera try-on with shade selection, intensity, effect comparison, camera switch, aspect ratio, fullscreen and photo capture.
- English is the page and interface language.
- MediaPipe model and WASM files are included under `public/vendor/mediapipe/`; `next.config.ts` routes the versioned camera asset URLs.

Illumina has no entries in the Malaysia SKU mapping at source commit `b9c80bd`. The ten codes and names come directly from `public/swatches/swatches-eye/swatches-illumina/swatches-illumina-1.jpg`. Colors approximate the photographed chart; they are not measured matches or retailer availability data. The old generic five-shade preset is replaced with the actual chart names and codes. Product description and claims retain the original catalog content.

The source project and pre-existing files in this folder are preserved. No environment secrets, repository history or existing deployment links were copied. No account or database is needed for this product card and camera flow.
