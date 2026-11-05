# Personal chart on the public homepage

Operator requirement, 27 October 2026: the chart in the calculated-placements
section must reproduce the person's actual onboarding chart, its existing
aesthetic, slow rotation and 3D interaction. An illustrative wheel is not the
requested result.

`marketing.html` mounts `src/marketing.tsx`, which reuses `Astrolabe3D` without
changing its renderer. Firebase identifies the account. The page loads that
UID's saved intake through the same local and Firestore intake functions used
by onboarding and calls the existing `calculateNatalChart` implementation.
Account changes invalidate pending results and clear chart selection. A local
chart stays visible while a newer cloud intake is calculated.

The reused component provides rotation, dragging, zoom and selectable chart
entities. Homepage controls pause rotation and reset the view. Reduced-motion
preferences and viewport visibility control automatic rotation. The stage is
square and explicitly sized without importing application-wide CSS.

Signed-out visitors and accounts without intake receive a real onboarding
link, not invented planetary placements. Errors show retry. The caption is
derived from the actual intake, including unknown birth time.

Observed locally: the homepage mounts and renders the signed-out onboarding
state; the app destination renders its sign-in screen. The former primary SVG
has been removed. Signed-in personal-chart rendering, 3D gestures on physical
devices, canonical build and deployed verification remain outstanding. A
separate illustrative chart-attention section is unchanged by this patch.
