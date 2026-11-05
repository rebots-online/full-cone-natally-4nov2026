# Inset chart source review

Correction: the original review below was insufficient. Explicit gesture guards
disabled inset drag/zoom/selection, while inert content and a full-card button
prevented canvas interaction. The operator identified the regression. The original
no-correction conclusion is withdrawn. See inset-controls-repair-20261029.md for
the corrective review; actual deployed interaction remains a required check.

Architecture 9d125712; checklist a0483292. Source is the same checkpoint as this
record. Build is authorized; only recording remains held.

| Requirement | Actual source assessment |
| --- | --- |
| INSET-01 | Same real chart, glyphs, bodies, aspect geometry and focus treatment retained. Inset receives solid dark backdrop and no covering caption gradient. |
| INSET-02 | Inset skips HTML endpoint card/leader creation, replaces NOW plaques with compact cyan glyphs and guards tooltip/annotation display against later updates. Now focusing overlay and inset caption text are absent in inset mode. Accessible named full-card action and drag handle retained. |
| INSET-03 | App derives mode solely from presentation.view. Full foreground restores endpoint cards, NOW plaques and tooltip/selection; other chart consumers default full. |
| INSET-04 | Outer renderer/camera/wheel effect remains mounted with empty dependencies. Only dynamic chart detail gains annotationMode. Inset discards fling velocity, retaining orientation and existing slow drift; pause, drift-off and system reduced motion are respected. |
| INSET-05 | Existing narration/manual Follow wiring unchanged. Manual view disables Follow; focus actions do not force view. Chart can remain inset while narration continues highlighting its subject. |
| INSET-06 | Actual natal/current endpoints, aspect glow, unknown-time behavior and foreground interactions preserved; no pricing, identity, provider or inference changes. |

No necessary coder correction identified from the complete four-file diff.

## Actual observations and limits

Opened the actual signed-in production app at https://natally.surge.sh/?app=1,
version 1.13.86779. Its inset shows the reported NOW plaques and covering captions.
Real saved reading/voice content and view controls are available for later proof.
A before screenshot was captured outside the repository for UI comparison.

Opened the existing integrated development server at http://localhost:49418/?app=1.
The real sign-in form rendered, without a framework overlay. Actual Google login
returned Firebase auth/unauthorized-domain, as did the earlier 127.0.0.1 origin.
No domain, account, credential or injected runtime state was changed to bypass it.
This affects local authenticated observation, not source progress or the authorized
build. The new chart's actual contrast, drift, foreground/inset transitions and
spoken focus still require observation after the coordinated release is served.

Build/deployment and continuous recording are not claimed here. Run rubric I1–I5
on the real matching app; retain screenshots and actual outcomes, and record only
after the operator lifts the recording hold.
