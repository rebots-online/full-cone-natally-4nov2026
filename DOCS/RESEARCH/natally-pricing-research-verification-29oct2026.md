# Pricing research report delivery

Task 23. Completed 29 October 2026.

Deliverable: [Natally pricing and package research](natally-pricing-and-pack-research-29oct2026.docx).
Reproducible source: [Python generator](generate-natally-pricing-research-29oct2026.py).

The four-page Word document contains six interactive-service comparisons,
separate natal/synastry report benchmarks, dated customer reviews and discussions,
currency and allowance qualifications, and implications for the operator's
requested 9.99 reading and 5 entry-pack defaults. It preserves the existing
monthly-primary direction. Those requested defaults remain intended and unapplied
by this research artifact; no price, package allowance or provider configuration
was changed in producing the report.

## Verified artifact

- Final DOCX length: 44,226 bytes.
- SHA-256: `0fac297caa548802bfcc06e42e68846c656db246dff9677f416b4a801bb75227`.
- Four pages rendered at 150 DPI. The document author inspected every final page;
  the supervising agent also inspected all four final page images.
- Legible tables and hyperlinks, intact wrapping, clean page breaks and page
  numbers, no clipped text or orphan overflow page.
- DOCX ZIP and hyperlink relationships validated; 19 distinct external HTTPS
  source targets. The document accessibility audit returned zero high, medium
  or low findings.
- Windows QA used hidden Microsoft Word PDF export with the packaged document
  renderer's PNG pipeline because the bundled runtime has no LibreOffice binary.
  Final page images were inspected in the local temporary QA directory; these
  intermediates are not additional requested deliverables.

## Recreate the Word document

Run the committed generator with a Python environment containing `python-docx`:

```powershell
python DOCS/RESEARCH/generate-natally-pricing-research-29oct2026.py
```

For this Codex workspace, use the Python executable returned by
`load_workspace_dependencies` rather than a system or repository installation.
The generator writes beside itself, includes the authored content and all source
links, and makes no network, app, checkout or configuration changes. Its generated
creation/modification timestamps reflect regeneration, so a later file need not
have the delivery hash above. Re-render and visually inspect after content or
format changes before delivering a replacement.

Official advertised prices and historical customer reports are kept separate.
The research establishes neither completed competitor purchases nor optimal
Natally pricing, profit, conversion rates or equivalent vendor units. No currency
conversion or unverified credit-to-conversation equivalence is assumed.
