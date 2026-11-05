export const meta = {
  name: 'r12-round-dispatch',
  description: 'Frozen R12 round: five parallel coders (A-E) edit disjoint scopes in place; fresh supervisors validate total state against each frozen CHECKLIST block; deficiencies return to the same task for correction',
  phases: [
    { title: 'Dispatch', detail: 'five coders, disjoint closed scopes, edits in the working tree' },
    { title: 'Validate', detail: 'one fresh supervisor per task compares total state to the frozen contract' },
    { title: 'Correct', detail: 'same-task correction and re-verification for failures' },
  ],
}

const ROOT = '/home/robin/Desktop/DevProjects/natally-ai-studio'
const COMMON = '62-105'

const TASKS = [
  { id: 'R12-A', lines: '106-186', scope: 'src/marketing.tsx src/marketing.css',
    note: 'A crashed session already implemented most of A1-A8 in src/marketing.tsx; known gap: the A4 example caption text and the "Create your natal chart" link are NOT yet rendered anywhere (an exampleCaptionShown flag is derived but unused). Complete to the full contract.' },
  { id: 'R12-B', lines: '188-251', scope: 'src/components/Astrolabe3D.tsx',
    note: 'A crashed session already added pendingInsetSelectionRef/queueInsetSelection, the transitionend settle hook, and structureFrame flags on the five structural meshes. Known gaps: B1 two-path rewrite of onClick (the activateRef short-circuit before raycasting is still unconditional around line 572), B2 clears on unmount/drag start/chart rebuild/new pointerdown, B3 exemptions in the focus dim traverse and applyHover (CHART_FOCUS.dim still multiplies frame materials around lines 1348/1373, and the comment around line 1336 still says "including the metal frame"). Complete to the full contract.' },
  { id: 'R12-C', lines: '252-326', scope: 'src/App.tsx src/components/NatallyChatbot.tsx src/components/ReadingStage.tsx', note: '' },
  { id: 'R12-D', lines: '327-386', scope: 'src/services/authoredChartExplanations.ts src/services/authoredEducationSession.ts',
    note: 'src/marketing.tsx (owned by R12-A) already imports getAuthoredUpsellClose(chart, variant) and calls it as getAuthoredUpsellClose(chart, "default") — implement exactly that frozen export signature.' },
  { id: 'R12-E', lines: '387-463', scope: 'src/main.tsx scripts/build-web.mjs scripts/stage-marketing-overlay.mjs scripts/pwa-build.mjs .env.example .env',
    note: 'Effective .env: append ONLY the six frozen keys at their defaults as new lines; change no existing value or line (house rule and E1 both require this).' },
]

const VERDICT = {
  type: 'object',
  properties: {
    task: { type: 'string' },
    pass: { type: 'boolean' },
    requirements: { type: 'array', items: { type: 'object', properties: {
      id: { type: 'string' }, status: { type: 'string' }, evidence: { type: 'string' } },
      required: ['id', 'status', 'evidence'] } },
    deficiencies: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['task', 'pass', 'requirements', 'deficiencies'],
}

const coderPrompt = t => `You are coder ${t.id} in the Natally R12 round. Canonical root: ${ROOT} (branch master).

FIRST, with the Read tool, read two excerpts of ${ROOT}/CHECKLIST.md:
1. Lines ${COMMON} — shared coder instructions and the frozen environment-key table. They bind you absolutely.
2. Lines ${t.lines} — YOUR task block (${t.id}). It is the single authority for your work: it restates everything you need. Do not open neighboring files beyond your scope list, do not explore the repo, do not improve anything outside the numbered requirements.

Then work ONLY your task, in place, in the working tree. Your scope (closed set): ${t.scope}
${t.note ? '\nRecovery note: ' + t.note : ''}
Partial edits from a crashed prior session may exist in your files; the task is idempotent — drive the files to the complete end state the block defines, keeping what already conforms and preserving everything the block says to preserve.

Hard rules: no builds, deploys, typecheck, lint, tests or recordings; no git state changes (commit/push/branch/stash) — read-only "git diff -- <your files>" is allowed and expected for your report; no new dependencies, providers or configuration; no placeholder or mock content; reduced-motion, accessibility and existing guards are sacred. If anything seems wrong or blocked, STOP and return a blocker report with the exact line — do not self-rescue.

Your final message is your mandated report, raw: (a) unified diff of every file you touched; (b) requirement-to-diff mapping table, one row per numbered requirement; (c) "RESOLVED: ${t.id} -> <file>:<line> [anchor=<name>]" lines for every block you added or moved; (d) any blocker with the exact blocking line.`

const verifyPrompt = t => `You are the semantic-validation supervisor for ${t.id} in the Natally R12 round. Canonical root: ${ROOT}.

Read ${ROOT}/CHECKLIST.md lines ${t.lines} (the frozen task block) and lines ${COMMON} (binding coder instructions). Then inspect the CURRENT working-tree state of the scope files (${t.scope}): run read-only "git diff -- ${t.scope}" AND read the current file content at the anchors the block names (local refs and userData properties do not appear in symbol indexes — read the regions directly).${t.id === 'R12-E' ? ' Additionally read the effective .env directly and verify exactly the six frozen keys were appended at their defaults with no other line changed.' : ''} The visible diff may mix a crashed session's edits with the coder's — judge TOTAL current state against the contract (the accept clauses are idempotent).

Judge requirement-by-requirement (${t.id} numbered clauses) plus the block's Preserve, Forbidden and Accept clauses: every requirement implemented as written, nothing extra beyond scope, preservation intact, no placeholders. Do NOT edit anything. No proxy attestation: cite file:line evidence per requirement.

Return via StructuredOutput: task, pass (true only if every requirement is fully implemented with nothing extra), requirements[] (id, status: implemented|partial|missing|wrong, evidence), deficiencies[] (exact actionable one-liners, empty if none), blockers[].`

const correctPrompt = (t, defs) => `You are coder ${t.id} returning for correction in the Natally R12 round. Canonical root: ${ROOT}. Read ${ROOT}/CHECKLIST.md lines ${COMMON} (shared coder instructions) and lines ${t.lines} (your task block — the single authority).

The supervisor found these deficiencies:
- ${defs}

Correct them in place in your scope files (${t.scope}) under the same rules: only your scope, no builds/typecheck/tests, no git state changes, preserve everything not named, no placeholders. Fix exactly these deficiencies and anything they directly imply; do not rewrite conforming work.

Final message: (a) updated unified diff of your files; (b) deficiency-to-fix mapping; (c) updated "RESOLVED: ${t.id} -> ..." lines.`

log('R12 dispatch: five coders on disjoint scopes (A marketing replica, B renderer two-path, C app education, D prefab content, E entry unify)')
const results = await pipeline(TASKS,
  async t => {
    const report = await agent(coderPrompt(t), { label: 'code:' + t.id, phase: 'Dispatch' })
    log(t.id + ' coder returned ' + (report && report.length ? 'a report (' + report.length + ' chars)' : 'NOTHING'))
    return { t, report }
  },
  async prev => {
    if (!prev) return null
    const verdict = await agent(verifyPrompt(prev.t), { label: 'verify:' + prev.t.id, phase: 'Validate', schema: VERDICT })
    if (verdict) log(prev.t.id + (verdict.pass ? ' validated' : ' FAILED validation (' + verdict.deficiencies.length + ' deficiencies)'))
    return { ...prev, verdict }
  },
  async prev => {
    if (!prev) return null
    const { t, verdict } = prev
    if (!verdict) return { ...prev, failed: 'verifier unavailable' }
    if (verdict.pass) return prev
    log(t.id + ' returning to same coder for correction')
    await agent(correctPrompt(t, verdict.deficiencies.join('\n- ')), { label: 'correct:' + t.id, phase: 'Correct' })
    const verdict2 = await agent(verifyPrompt(t), { label: 'reverify:' + t.id, phase: 'Correct', schema: VERDICT })
    log(t.id + (verdict2 && verdict2.pass ? ' corrected and validated' : ' STILL failing after correction — holding for orchestrator'))
    return { ...prev, verdict: verdict2 || verdict, corrected: true }
  }
)
const summary = results.filter(Boolean).map(r => ({
  task: r.t.id,
  pass: !!(r.verdict && r.verdict.pass),
  corrected: !!r.corrected,
  deficiencies: r.verdict && r.verdict.pass ? [] : (r.verdict ? r.verdict.deficiencies : ['no verdict']),
  blockers: r.verdict ? r.verdict.blockers : [],
}))
log('R12 dispatch+validation complete: ' + summary.filter(s => s.pass).length + '/5 passed')
return summary