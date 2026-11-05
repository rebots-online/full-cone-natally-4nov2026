# Inset chart controls repair

Architecture e9acb5e2, coder recipe94dc6a61. Parent reviewed the full five-file
diff and the mouse/touch/zoom/selection handlers, pane accessibility, overlays,
animation loop and App selection callback.

Annotation visibility now controls labels only. Both real chart canvases receive
mouse/touch input, no chart-covering button or inert pane remains, and existing
toolbar actions foreground the chart. Drag, pinch, wheel and selection no longer
depend on foreground placement. Same renderer/camera remains mounted. Hidden
labels remain suppressed through hover/focus; real geometry and highlight remain.

The parent returned a drag-release defect to the same coder: a mouse drag could
also click a planet and start an explanation. The corrected movement tracking
suppresses that trailing click while preserving deliberate selection and touch
gesture suppression. No Follow/narration policy, pricing or provider change.

The gated rehearsal source was restored exactly to its prior HEAD version; its
removal had been unrelated and based on an incorrect placeholder classification.

Source semantic review passes this scoped correction. Actual owner-chart rotation,
pinch/wheel, view continuity and narration must still be observed after the
coordinated build/deployment; local real sign-in currently rejects the development
origin. No fabricated chart/account or runtime injection was used. Recording held.
