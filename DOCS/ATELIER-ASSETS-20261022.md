# Shaded atelier assets — 22 October 2026

Produced with the built-in image generation tool, using Robin's supplied atelier
screenshot and archived Natally mascot as identity/composition references.
The reference images remain unchanged. No fal credit, top-up or subscription was
used for this generation.

Source references:
- LIBS/UI/OPENDESIGN/atelier-conversation-20261017/inspected-desktop.jpg
- LIBS/UI/OPENDESIGN/atelier-conversation-20261017/assets/natally-mascot.webp

Generated original: exec-c53b0cc3-8440-40da-934e-db2223f2521f.png, retained in the
local Codex generated_images directory. Actual raster size: 1586 × 992. The SVG
animation coordinate system is 2048 × 1280; this is a coordinate basis, not a
claim that the source raster has 2048 pixels. No upscaling or silhouette cutting.

Public assets are WebP encodings of the original composition using existing
bundled Sharp tooling, quality 90 (room) and 72 (independent static poster).
Room: 277,480 bytes. Poster: 138,536 bytes. Total: 416,016 bytes before manifest,
below the 6 MiB art budget. Exact hashes/size are in public/atelier/manifest.json.
The detailed composite keeps lighting and contact shadows coherent; procedural
masked motion overlays supply sand, armillary, flames, ball clouds and sky.

Visual inspection of generated output confirmed the silver robot, amber eyes,
purple velvet/gold clothing, hands/ball and shaded wood/glass/brass room.
The generator did not exactly follow requested object coordinates and painted
small flames. Overlay coordinates are therefore taken from the actual image,
not assumed from the prompt. No claim of runtime animation acceptance follows
from this still. Final demonstration scenes 2, 9 and 11 establish delivered use.

## Generation prompt

Use case: identity-preserve. Production art for Natally's interactive candlelit atelier. Use the reference screenshot for room arrangement and the mascot image for exact character identity. Create ONLY the scene image, no UI or text/borders/logo. Wide landscape 2048x1280 composition. Hyperrealistic cinematic physical materials and finely shaded 3D character while preserving this endearing little silver robot: huge amber/brown eyes, small smile, lavender cheek lights, purple velvet turban with gold crescent/star and purple jewel, purple star embroidered cloak, metal hands holding a glowing glass crystal ball. Remove the mascot circular border. Warm intimate old wood atelier shelves behind her, patinated brass, glass potion bottles, crystals, leather books. Natural wood grain, velvet fibers, metal reflections, glass refraction, soft contact shadows and warm amber candlelight blending with violet ball light. Character centered: head around (1024,460), crystal ball center (1024,930) radius150 in 2048x1280 coordinates. Room fills whole image. Front tabletop grounded with shadows. Shelves left and right have deliberately clear regions for interactive animated overlays: leave empty small shelf spaces at (360,710) for hourglass and (1660,715) for brass armillary; DO NOT paint those two objects, they will be layered in code. Four slim ivory candles with wick tops at approximately (225,610),(620,595),(1480,595),(1840,610), no painted flames because flames will be animated overlays. Dark navy star-window area across top y90..270 behind head, sparse small stars, NO connected constellation lines (animated overlay). Crystal sphere beautiful static glass rim/reflections and softly cloudy violet/amber interior without sharp painted lightning, animated scrying will overlay. Match all lighting harmoniously and realistic depth; avoid flat cutouts, cartoon vector shelves, text, captions, UI, harsh borders. Complete closeup fills frame yet leaves shelves readable. Preserve original character identity, no human replacement.

## Articulated character amendment

Generated an image-edit clean plate from room.webp using image_gen, preserving
framing/background/torso/crystal while removing head and forearms and reconstructing
what lies behind them. Source generation exec-000ed7b8-3515-4a29-bf44-156886b247cf.png
was inspected by the atelier worker for alignment and clean reconstruction.
public/atelier/puppet-cleanplate.webp is 1585x992, 266970 bytes; all three room
rasters total 682986 bytes. Current SHA256 values are in the asset manifest.
AtelierCharacter clips the original shaded head and hands over this clean plate,
with mechanical mouth shapes and CSS articulation driven by actual voice events.
This supersedes the original no-silhouette-cutting implementation description:
the current deliberate layered rig avoids duplicating unmoving body parts.
No fal credits used. Actual motion remains subject to the integrated journey.
