from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

root = Path(__file__).resolve().parents[1]
rows = []
for line in (root / 'CHECKLIST.md').read_text(encoding='utf-8-sig').splitlines():
    cells = [v.strip() for v in line.split('|')[1:-1]]
    if len(cells) == 3 and ('NOT_STARTED' in cells[0] or 'BLOCKED' in cells[0]):
        rows.append((cells[1], cells[2], 'HELD' if 'BLOCKED' in cells[0] else 'NOT STARTED'))

details = {
 'REDEMPTION-OUTCOME': ('First on resumption', 'The adapter correction is deployed in billing revision 00006-6mh. The customer must receive the configured available allowance and usable service; a retry of the same request must not apply another grant. Preserve the request identity.'),
 'PURCHASE-OUTCOME': ('After usable redemption', 'Close the real selected-amount purchase through balance, working reading/conversation, accurate tax, confirmation, official invoice and purchase history. Recovery and cancellation must preserve the actual transaction.'),
 'MINIMAL-BILLING': ('Architecture before coding', 'Reuse the Google name and email and actual existing buyer/provider facts. Ask only for missing transaction-required information. Do not invent an address or jurisdiction from Google sign-in.'),
 'ZERO-BALANCE': ('Architecture before coding', 'A verified zero balance should be hidden rather than repeating 0 Cr. Keep useful actions and distinguish unavailable or unknown balances from zero.'),
 'TOPUP-LANDING': ('After redemption repair', 'Top Up must go to the landing-page explanations. Show the customer the service and what they receive before amounts; preserve identity and intent and avoid bouncing them back without the explanation.'),
 'INAPP-OFFER-CONTENT': ('After TOPUP-LANDING works', 'Import the explanatory content into the app, then restore the intended native Google Play billing flow. Keep the experience and purchased service consistent across platforms.'),
 'RESTORE-VALUE': ('Verified provider facts required', 'Restore actual paid value once. A records refresh alone is insufficient. Preserve ownership and idempotence and report incomplete restoration accurately. Do not repeat the abandoned account/transaction-ID hunt.'),
 'ACCOUNT-ACTIONS': ('Architecture before coding', 'Retry and Restore belong on the same compact row. Wrap only when the available width requires it; preserve clear labels, accessibility and the real action results.'),
 'SERVICE-OFFERS': ('Customer value leads payment', 'Finish the approved dedicated full-workup offer, dedicated guided-exploration offer, then comparison. Each needs actual inclusions, matching catalog terms, a direct purchase action and the promised delivery. Do not advertise unimplemented keepsakes or relabel legacy prices.'),
 'PLAY': ('After INAPP-OFFER-CONTENT', 'Finish native Android purchases, subscriptions, restoration and correct account fulfillment. Preserve the actual platform purchase authority and selected offer.'),
 'PREFAB-GENZ': ('Architecture and assigned coder before source changes', 'Restore Natally\'s specified Gen Z lingo in prefab free content. Correct the authored text templates and their actual presentation routes, not only a persona prompt for generated paid replies. Preserve factual explanations, free availability, speech admission and unique lore; confirm the voice in actual free passages in text and speech.'),
 'SOUVENIR': ('Actual purchase and delivery', 'Finish the separate personalized interactive reading, retained content, live add-on handoff and animated PDF flipbook with optional sound. Keep this separate from ordinary conversation top-ups.'),
 'SOUVENIR-OFFERS': ('Depends on deliverable souvenir', 'Finish the airplane-towed sign, cookie marquee and coordinated spoken invitation for the current reading. Use the agreed triggers and one-turn cookie wording; respect busy speech, mute and reduced motion, and stop after purchase.'),
 'COST-STATS': ('Use actual completed turns and costs', 'Separate supplier expense, internal transfer price and customer Cr. Derive a questions-remaining estimate from measured completed questions rather than a fabricated fixed quota.'),
 'ANALYTICS': ('brAInstormer migration explicitly queued', 'Complete interaction/commercial measurements and the brAInstormer product-to-Google-Analytics map. Its intended two-way model places instrumentation on the UI and maps existing tags back. The operator said not to undertake that migration now.'),
 'PLATFORM-RELEASE': ('Held until web purchasing works', 'Run only the canonical automatic build and publication coordinator. It owns all requested platform artifacts, signing configuration, version increments and build identities. Never build individual platforms manually.'),
 'DELIVERY-EVIDENCE': ('After the relevant implementation', 'Record the actual customer journey, purchase/redemption outcomes, desktop/narrow presentation, inset callouts, narration and session continuity. Tie evidence to source and release; an outstanding recording does not mean a completed feature must be rewritten.'),
}
groups = [
 ('Restore usable service and customer trust', ['REDEMPTION-OUTCOME','PURCHASE-OUTCOME','MINIMAL-BILLING','ZERO-BALANCE','RESTORE-VALUE','ACCOUNT-ACTIONS']),
 ('Offer a service customers can understand and choose', ['TOPUP-LANDING','SERVICE-OFFERS','INAPP-OFFER-CONTENT','LC-04/05']),
 ('Finish entry installation and personal readings', ['LC-02','LC-06','AUTH','PLAY','READING-FLOW','NAVIGATION']),
 ('Finish the reading room and retained products', ['ATELIER','VOICE-STORIES','PREFAB-GENZ','LORE','SOUVENIR','SOUVENIR-OFFERS','SEASONAL','LOCATION']),
 ('Measure deliver and resume responsibly', ['COST-STATS','ANALYTICS','PLATFORM-RELEASE','DELIVERY-EVIDENCE']),
]
lookup = {i:(outcome,status) for i,outcome,status in rows}
assert set(lookup) == {i for _, ids in groups for i in ids}, 'Every outstanding task must be represented once'

doc = Document()
sec = doc.sections[0]
sec.page_width = Inches(8.5); sec.page_height = Inches(11)
sec.top_margin = sec.bottom_margin = Inches(.65)
sec.left_margin = sec.right_margin = Inches(.7)
styles = doc.styles
styles['Normal'].font.name = 'Calibri'; styles['Normal'].font.size = Pt(11)
styles['Normal'].paragraph_format.space_after = Pt(6)
styles['Normal'].paragraph_format.line_spacing = 1.06
styles['Title'].font.name = 'Calibri'; styles['Title'].font.size = Pt(24)
styles['Title'].font.color.rgb = RGBColor(0,0,0)
styles['Heading 1'].font.name = 'Calibri'; styles['Heading 1'].font.size = Pt(15)
styles['Heading 1'].font.color.rgb = RGBColor(27,47,70)
styles['Heading 1'].paragraph_format.space_before = Pt(16)
styles['Heading 1'].paragraph_format.space_after = Pt(7)
doc.core_properties.title = 'Natally outstanding tasks and development handoff'
doc.core_properties.author = 'Natally project handoff'
doc.add_paragraph('Natally outstanding tasks and development handoff', 'Title')
doc.add_paragraph('31 October 2026', 'Subtitle')
doc.add_paragraph('Product development is stopped on the operator\'s instruction because quota is exhausted. This is the comprehensive remaining work list for an explicitly authorized resumption. It excludes completed tasks and orders the work around usable customer service, truthful purchases and complete delivery.')
doc.add_paragraph('First priority is the actual redemption outcome. The committed adapter correction has deployed to the billing service; customer success remains open. The published web iteration contains the inset-callout and benefit-copy corrections, while the full commercial offer is still unfinished.')
p = doc.add_paragraph()
for label, color in [('NOT STARTED  ', '9C6500'), ('IN PROGRESS  ', '1769AA'), ('HELD  ', 'AA2525'), ('COMPLETE then remove', '217346')]:
    run=p.add_run(label); run.bold=True; run.font.color.rgb=RGBColor.from_string(color); run.font.size=Pt(9)
doc.add_paragraph('All listed work is queued or held at this handoff. Existing partial implementation must be preserved. Future operators should mark only the assignment they are actually executing as in progress, attach its evidence, and remove completed outcomes from the open list.')

for heading, ids in groups:
    doc.add_paragraph(heading, 'Heading 1')
    table=doc.add_table(rows=1, cols=2)
    table.autofit=False
    table.columns[0].width=Inches(.95); table.columns[1].width=Inches(6.15)
    table.rows[0].cells[0].text='State'; table.rows[0].cells[1].text='Task and completion condition'
    table.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    for cell in table.rows[0].cells:
        shading=OxmlElement('w:shd'); shading.set(qn('w:fill'),'E7EDF3'); cell._tc.get_or_add_tcPr().append(shading)
        for run in cell.paragraphs[0].runs: run.bold=True
    for task in ids:
        outcome,status=lookup[task]
        dependency, body=details.get(task, ('Finish the existing assigned implementation', outcome))
        cells=table.add_row().cells
        shading=OxmlElement('w:shd'); shading.set(qn('w:fill'),'FCE3E3' if status=='HELD' else 'FFF2CC')
        cells[0]._tc.get_or_add_tcPr().append(shading)
        r=cells[0].paragraphs[0].add_run(status); r.bold=True; r.font.size=Pt(9)
        r.font.color.rgb=RGBColor.from_string('AA2525' if status=='HELD' else '865800')
        p=cells[1].paragraphs[0]; p.add_run(task).bold=True
        p.add_run('\n'+body)
        r=p.add_run('\nDependency  '+dependency); r.italic=True; r.font.color.rgb=RGBColor(80,80,80)
        for cell in cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_after=Pt(5); p.paragraph_format.space_before=Pt(5)
        table.rows[-1]._tr.get_or_add_trPr().append(OxmlElement('w:cantSplit'))

doc.add_paragraph('Execution and handoff rules', 'Heading 1')
rules=[
 'Use architecture first, independent recipes and a preauthored observation rubric, assigned subagents, same-coder correction and a truthful source attestation before the canonical release. Use CodeGraph narrowly for source questions and editing context.',
 'The customer is buying personal readings and guided exploration. Explain the benefit and deliverables before payment mechanics. No provider names, keys or account-control internals belong in that explanation.',
 'Preserve the configured redemption semantics, exact actual-cost accounting, RevenueCat balance authority and actual tax/receipt facts. No placeholders, invented grants, fabricated customer outcomes or repeated charges.',
 'The canonical script owns build identities and every platform artifact. Platform delivery stays held until web purchasing works. Keep brAInstormer migration queued and preserve quota for EnZIME and Squash Arcade.',
 'The technical handoff is DOCS/HANDOFF-20261031.md. The current open recipe is CHECKLIST.md. Read both before resuming; inspect the current checkout and external state and preserve the unrelated local icon change.',
]
for text in rules: doc.add_paragraph(text, 'List Bullet')
footer=sec.footer.paragraphs[0]
footer.alignment=2
footer.add_run('Natally handoff   ')
field=OxmlElement('w:fldSimple'); field.set(qn('w:instr'),'PAGE'); footer._p.append(field)
out=root/'DOCS'/'Natally-outstanding-tasks-20261031.docx'
doc.save(out)
print(f'Created {out} with {len(rows)} open tasks')
