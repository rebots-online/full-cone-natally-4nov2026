/** Tunable art direction, not an empirical timing or golden-ratio claim. */
export const CHART_FOCUS = { dim: 0.19, steadyHalo: 0.64, peakHalo: 0.94, pulseMs: 720, pulses: 2 } as const;
export function chartHaloOpacity(elapsedMs: number, reducedMotion: boolean): number {
  const duration = CHART_FOCUS.pulseMs * CHART_FOCUS.pulses;
  if (reducedMotion || elapsedMs >= duration) return CHART_FOCUS.steadyHalo;
  const wave = (1 - Math.cos(Math.max(0, elapsedMs) * 2 * Math.PI / CHART_FOCUS.pulseMs)) / 2;
  return CHART_FOCUS.steadyHalo + (CHART_FOCUS.peakHalo - CHART_FOCUS.steadyHalo) * wave;
}

/** Place the inset callout in surrounding space, using viewport coordinates. */
export function chartTooltipPosition(
  inset: {left:number;top:number;right:number;bottom:number},
  tooltip: {width:number;height:number}, viewport: {width:number;height:number},
): {left:number;top:number} {
  const gap = 12, margin = 8;
  const candidates = [
    {left:inset.left-tooltip.width-gap,top:inset.top},
    {left:inset.right+gap,top:inset.top},
    {left:inset.left,top:inset.bottom+gap},
    {left:inset.left,top:inset.top-tooltip.height-gap},
  ];
  const clamp = (value:number,size:number,limit:number) => Math.max(margin, Math.min(value,limit-size-margin));
  const positions = candidates.map(p => ({left:clamp(p.left,tooltip.width,viewport.width),top:clamp(p.top,tooltip.height,viewport.height)}));
  return positions.find(p => p.left+tooltip.width <= inset.left || p.left >= inset.right || p.top+tooltip.height <= inset.top || p.top >= inset.bottom) || positions[2];
}

export function applyChartFocusMaterial(material: import('three').Material, transientFocus: boolean, subject: boolean): void {
  if (!material.visible) return;
  if (material.userData.focusBaseOpacity === undefined) {
    material.userData.focusBaseOpacity = material.opacity;
    material.userData.focusBaseTransparent = material.transparent;
  }
  material.transparent = transientFocus || material.userData.focusBaseTransparent;
  material.opacity = material.userData.focusBaseOpacity * (transientFocus && !subject ? CHART_FOCUS.dim : 1);
  material.needsUpdate = true;
}
