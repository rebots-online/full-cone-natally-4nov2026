"""Generate the dated Natally research DOCX from the verified research findings.

Run with the Codex bundled Python runtime. No network access, app changes,
checkout actions, or configuration mutations are performed by this generator.
Source hyperlinks refer to the public pages reviewed on 29 October 2026.
"""
from pathlib import Path
from datetime import datetime, timezone
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "natally-pricing-and-pack-research-29oct2026.docx"
SOURCES = {
    "costar": "https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561",
    "costarfaq": "https://www.costarastrology.com/faq",
    "astroclub": "https://apps.apple.com/us/app/astroclub-astrology-tarot/id1436937231",
    "clubsite": "https://www.astroclub.com/",
    "sitare": "https://sitareai.com/pricing",
    "inturning": "https://inturning.com/pricing",
    "astroo": "https://astroo.ai/pricing",
    "medha": "https://astromedha.in/pricing",
    "cansee": "https://www.canseeastrology.com/en/pricing",
    "greenenatal": "https://www.astro.com/prod/pr_ph_e.htm",
    "greenerel": "https://www.astro.com/prod/pr_tp_e.htm",
    "forecast": "https://www.astro.com/prod/pr_at_e.htm",
    "starcrow": "https://starcrow.com/astrology-readings",
    "starcrowpdf": "https://starcrow.com/astrology-reports",
    "jiva": "https://www.reddit.com/r/vedic_astro_questions/comments/1s0o8zi/have_created_an_ai_astrology_app_need_your/",
    "calculators": "https://www.reddit.com/r/astrologymemes/comments/1kz9e5p/master_list_of_online_calculators_for_birth/",
    "greene2021": "https://www.reddit.com/r/AskAstrologers/comments/m2gw27/first_time_buying_natal_chart_report/",
    "greene2024": "https://www.reddit.com/r/astrology/comments/1g9gtaw/is_there_any_author_like_liz_greene/",
    "pdfcomplaint": "https://www.reddit.com/r/LetsFuckWithAstrology/comments/1rpeumk/does_anybody_have_any_astrologer_recommendations/",
}

doc = Document()
sec = doc.sections[0]
sec.page_width = Inches(8.5)
sec.page_height = Inches(11)
sec.top_margin = Inches(.65)
sec.bottom_margin = Inches(.65)
sec.left_margin = Inches(.68)
sec.right_margin = Inches(.68)
sec.footer_distance = Inches(.28)

for name in ["Normal", "Body Text", "Title", "Subtitle", "Heading 1", "Heading 2", "Heading 3"]:
    style = doc.styles[name]
    style.font.name = "Aptos"
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.font.size = Pt(11)
    style.paragraph_format.space_after = Pt(6)
    style.paragraph_format.line_spacing = 1.08
    rpr = style.element.get_or_add_rPr()
    fonts = rpr.find(qn("w:rFonts"))
    if fonts is not None:
        fonts.set(qn("w:ascii"), "Aptos")
        fonts.set(qn("w:hAnsi"), "Aptos")
    for c in rpr.findall(qn("w:color")):
        for a in ["w:themeColor", "w:themeTint", "w:themeShade"]:
            c.attrib.pop(qn(a), None)
        c.set(qn("w:val"), "000000")

doc.styles["Title"].font.size = Pt(25)
doc.styles["Title"].font.bold = True
doc.styles["Title"].paragraph_format.space_after = Pt(10)
doc.styles["Subtitle"].font.size = Pt(13)
doc.styles["Subtitle"].paragraph_format.space_after = Pt(9)
doc.styles["Heading 1"].font.size = Pt(16)
doc.styles["Heading 1"].font.bold = True
doc.styles["Heading 1"].paragraph_format.space_before = Pt(13)
doc.styles["Heading 1"].paragraph_format.space_after = Pt(7)
doc.styles["Heading 2"].font.size = Pt(11)
doc.styles["Heading 2"].font.bold = True
doc.styles["Heading 2"].paragraph_format.space_before = Pt(8)
doc.styles["Heading 2"].paragraph_format.space_after = Pt(4)

for name in ["Title", "Subtitle", "Heading 1", "Heading 2", "Heading 3"]:
    ppr = doc.styles[name].element.get_or_add_pPr()
    for tag in ["w:pBdr", "w:shd"]:
        for e in ppr.findall(qn(tag)):
            ppr.remove(e)

def p(text="", bold_lead=None, style=None, after=None):
    out = doc.add_paragraph(style=style)
    if bold_lead and text.startswith(bold_lead):
        out.add_run(bold_lead).bold = True
        out.add_run(text[len(bold_lead):])
    else:
        out.add_run(text)
    if after is not None:
        out.paragraph_format.space_after = Pt(after)
    return out

def h(text, level=1):
    return doc.add_paragraph(text, style=f"Heading {level}")

def link(paragraph, label, url, size=9):
    rel = paragraph.part.relate_to(url, RT.HYPERLINK, is_external=True)
    el = OxmlElement("w:hyperlink")
    el.set(qn("r:id"), rel)
    run = OxmlElement("w:r")
    props = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "1F4E79")
    props.append(color)
    under = OxmlElement("w:u")
    under.set(qn("w:val"), "single")
    props.append(under)
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(int(size*2)))
    props.append(sz)
    run.append(props)
    text = OxmlElement("w:t")
    text.text = label
    run.append(text)
    el.append(run)
    paragraph._p.append(el)

def source_line(items):
    out = p(after=6)
    out.paragraph_format.line_spacing = 1.0
    for i, (label, key) in enumerate(items):
        if i:
            out.add_run("  |  ").font.size = Pt(9)
        link(out, label, SOURCES[key])
    return out

def page():
    doc.add_page_break()

def table(headers, rows, widths, font=9.6):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    for col, width in zip(t.columns, widths):
        col.width = Inches(width)
    for i, title in enumerate(headers):
        t.rows[0].cells[i].text = title
    repeat = OxmlElement("w:tblHeader")
    t.rows[0]._tr.get_or_add_trPr().append(repeat)
    for record in rows:
        cells = t.add_row().cells
        for i, val in enumerate(record):
            cells[i].text = val[0] if isinstance(val, tuple) else val
            if isinstance(val, tuple):
                cp = cells[i].add_paragraph()
                link(cp, val[1], SOURCES[val[2]], 8.5)
    for ri, row in enumerate(t.rows):
        trpr = row._tr.get_or_add_trPr()
        no_split = OxmlElement("w:cantSplit")
        trpr.append(no_split)
        for ci, cell in enumerate(row.cells):
            cell.width = Inches(widths[ci])
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            tcpr = cell._tc.get_or_add_tcPr()
            fill = OxmlElement("w:shd")
            fill.set(qn("w:fill"), "344C64" if ri == 0 else ("F2F5F8" if ri % 2 == 0 else "FFFFFF"))
            tcpr.append(fill)
            borders = OxmlElement("w:tcBorders")
            for side in ["top", "left", "bottom", "right", "insideH", "insideV"]:
                edge = OxmlElement(f"w:{side}")
                edge.set(qn("w:val"), "single")
                edge.set(qn("w:sz"), "5")
                edge.set(qn("w:color"), "D9D9D9")
                borders.append(edge)
            tcpr.append(borders)
            margins = OxmlElement("w:tcMar")
            for side, val in [("top", "85"), ("bottom", "85"), ("left", "90"), ("right", "90")]:
                mar = OxmlElement(f"w:{side}")
                mar.set(qn("w:w"), val)
                mar.set(qn("w:type"), "dxa")
                margins.append(mar)
            tcpr.append(margins)
            for para in cell.paragraphs:
                para.paragraph_format.space_after = Pt(2)
                para.paragraph_format.space_before = Pt(0)
                para.paragraph_format.line_spacing = 1.02
                for run in para.runs:
                    run.font.name = "Aptos"
                    run.font.size = Pt(font)
                    if ri == 0:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                if ri == 0:
                    para.paragraph_format.keep_with_next = True
    p(after=3)
    return t

# Page 1
p("Natally pricing and package research", style="Title")
p("AI astrology conversations and report keepsakes", style="Subtitle")
p("Research date 29 October 2026   |   Task 23   |   Prepared for the Natally operator", after=12)
p("The reviewed offers support a monthly plan as Natally's primary commercial model, with prepaid topups and separately purchased keepsakes as familiar complementary purchases. The operator's intended 9.99 reading and 5 entry pack are plausible starting prices. Their currency, included allowance and delivered experience determine the comparison; this research does not establish an optimal price.", bold_lead="The reviewed offers")
p("This report covers six services with personalized AI astrology questions or chat and two additional report sellers. It separates current advertised prices from dated customer accounts, then relates both to Natally's extensive natal or synastry PDF and personalized interactive-site keepsake.")
h("Implications for the intended offers")
h("Monthly plans remain primary", 2)
p("Retain the existing monthly-primary direction. The sample includes USD 4.99 for 30 questions per month and USD 9.99 for 100 at SitareAI, and USD 8.99 for 300 differently weighted credits at INTURNING. These offers show recognizable monthly packaging. They do not establish that the allowances are interchangeable or that a particular quota will be profitable for Natally.")
source_line([("SitareAI pricing", "sitare"), ("INTURNING pricing", "inturning")])
h("The reading price is a starting hypothesis", 2)
p("If 9.99 is USD, it matches SitareAI's Complete Kundli report and CANSEE's single-question report and sits below the broader CANSEE and Astrodienst reports. Natally's distinct value would need to come from coherent interpretation and the delivered interactive keepsake. Price alone does not establish that value.")
h("The entry pack needs a defined allowance", 2)
p("If the entry pack price of 5 is USD, it sits near Co-Star's USD 4.99 ten-question pack, AstroClub's USD 4.99 ten-gem pack and INTURNING's USD 5 fifty-credit pack. Each vendor defines a different unit. State Natally's actual allowance and clarify when a follow-up consumes it before comparing price per question or conversation.")
h("Evidence and decision status", 2)
p("The 9.99 reading and 5 entry pack are operator-requested defaults intended for configuration. They have not been applied by this research. Competitor prices are public-page observations as of the research date. Customer comments inform value and friction; their popularity or ratings do not prove willingness to pay at Natally's proposed prices.")

# Page 2
page()
h("Interactive pricing comparison")
p("USD denotes explicit US-dollar pricing or the US App Store. INR denotes Indian rupees. Astroo publishes a dollar symbol without a currency code. No currency conversion is applied. Monthly and annual billing are distinguished below.", after=8)
table(
    ["Product", "Advertised price", "Allowance and billing", "Included experience and limits"],
    [
        [("Co-Star", "US App Store", "costar"), "USD 2.99 / 5 questions\nUSD 4.99 / 10\nUSD 6.99 / 25\nPro-Star USD 8.99 / month", "Prepaid question packs plus a separate monthly subscription.", "Chart-based personal questions, horoscopes and compatibility. Pro-Star's question allowance is not established by the public listing. FAQ says unanswered questions do not consume credits."],
        [("AstroClub", "US App Store", "astroclub"), "USD 2.99 / 5 gems\nUSD 4.99 / 10\nUSD 12.99 / 30\nMonthly SKUs USD 9.99 and 14.99", "Gems plus subscription. Also listed: USD 4.99 weekly and USD 59.99 yearly.", "Skye guide, birth profile, transits, compatibility, tarot and personalized readings. A gem is not verified as one message or conversation. Multiple subscription prices coexist."],
        [("SitareAI", "Official pricing", "sitare"), "USD 4.99 / month\nUSD 9.99 / month\nUSD 19.99 / month\nTopup USD 1.99 / 5", "30, 100 or 300 questions per month respectively. Topups: USD 2.99 / 10 and USD 9.99 / 50.", "1 credit = 1 question. Purchased credits do not expire. Chart, dasha and live-transit context. First question free; up to ten family birth profiles."],
        [("INTURNING", "Official pricing", "inturning"), "USD 2 / 20 credits\nUSD 5 / 50\nUSD 8.99 / month\nUSD 24.99 / quarter\nUSD 83.99 / year", "Membership grants 300 credits each month. Purchased credits never expire; membership credits expire monthly.", "Deep report 10 credits; standard relationship report, tracking or report follow-up 0.5; casual chat answer 0.1. Saved rereading is free. No charge without successful delivery is advertised."],
        [("Astroo AI", "Official pricing", "astroo"), "$95.88 annually\n$7.99 / month equivalent\nHigher tier $359.88 annually\nCurrency code unspecified", "AstroLover annual offer shown. 500 shared chat credits and 3 PDF reports per month; allowances reset.", "1 message = 1 credit. Natal and relationship chat, chart analysis, and quotas for synastry, composite and horoscope generation. Annual payment must not be presented as monthly billing."],
        [("AstroMedha", "Official pricing", "medha"), "INR 99 / 3 answers\nINR 34 / 1\nINR 489 / 15\nINR 1,279 / 40\nPro INR 789 / month", "INR 99 pass: 3 answers within 24 hours of first use. Pro: 20 questions/month; annual INR 8,999.", "Personalized guidance and Chart Chat; Pro supports three profiles. Full written reading counts as one answer on the pass. INR 789 non-renewing month is also offered."],
    ],
    [1.0, 1.45, 1.62, 3.07],
    font=9.5,
)
p("Units are vendor-specific. A question, answer, gem, credit and complete conversation may buy different work. No token allowance, model cost or full-conversation equivalence is inferred.", bold_lead="Units are vendor-specific.", after=5)
source_line([("Co-Star credit rules", "costarfaq"), ("AstroClub AI description", "clubsite")])

# Page 3
page()
h("Reports and keepsake benchmarks")
p("These offers help assess the separate report purchase. They span AI-generated documents and authored, computer-assembled reports; their production methods and delivery terms affect the comparison.")
table(
    ["Product and category", "Price and billing", "Delivered scope"],
    [
        [("SitareAI\nAI report", "Official pricing", "sitare"), "USD 9.99 one-time\nComplete Kundli report", "A separately priced report. Other themed reports are USD 11.99 to 12.99. The pricing page does not establish a Natally-equivalent interactive-site deliverable."],
        [("Astroo AI\nAI PDF report", "Official pricing", "astroo"), "$2.99 one-time\nAdvertised discount from $9\nCurrency code unspecified", "30 to 40 pages for natal, synastry or composite analysis; report accessible in the customer profile. No subscription required."],
        [("CANSEE\nAI report and online access", "Official pricing", "cansee"), "USD 9.99 single question\nUSD 29.99 broader report\nOne-time purchases", "PDF plus online report. Broader report covers personality, relationships, career, wealth and life periods. Eligible first-purchase prices are USD 6.59 and 19.79. Chinese astrology/divination makes this a delivery benchmark."],
        [("Astrodienst\nAuthored automated report", "Natal report", "greenenatal"), "USD 69.90 or EUR 61.90\nPer natal or relationship report\nOne-time purchase", "Liz Greene natal report: 18 to 25 A4 pages. Relationship report: 35 to 40 pages. Immediate PDF and on-screen reading; stated report download/access limit six months."],
    ],
    [1.6, 1.85, 3.69],
    font=10,
)
source_line([("Astrodienst relationship report and terms", "greenerel")])
p("A dedicated personalized interactive site is a distinct deliverable. Saved dashboard access, a web-readable report and a custom interactive keepsake should have separate descriptions. The reviewed prices do not establish a directly equivalent keepsake bundle at 9.99.", bold_lead="A dedicated personalized interactive site is a distinct deliverable.")
h("Human consultation boundary", 2)
p("Starcrow advertises a 90-minute live natal consultation at $175 and a 60-minute transit consultation at $150. Its separate $42 relationship PDF package uses TimePassages software and practitioner compilation/editing. The pages do not state a dollar currency code. These are context for service and labor differences, not confirmed-USD AI-chat comparisons.")
source_line([("Live consultations", "starcrow"), ("Software report package", "starcrowpdf")])
h("Evidence limits", 2)
p("Official prices are advertised public-page offers, not verified checkout totals or completed deliveries. Taxes, regional storefronts, eligibility and promotions can change the amount charged. The smaller vendors' sales volumes and service performance were not established. This is a targeted comparison, not a statistically representative market survey.")
p("INTURNING's current page stated 300 monthly credits and fixed service rates; older search snippets still described 150 credits and processing-based deductions. The comparison uses the opened pricing page. No competitor's published rate proves Natally's inference cost, margin, conversion rate or appropriate monthly grant.")

# Page 4
page()
h("Dated customer reports")
p("These individual accounts show perceived value and purchase friction. They are self-selected reports, not representative surveys or independently verified transactions. Historical customer prices remain separate from the current official offers.")
h("Co-Star reviews from 2024 and 2025", 2)
p("On 11 August 2024, a daily user praised relationship comparisons and the writing but considered extra purchases expensive and mentioned repeated content. On 14 May 2025, another reviewer objected to roughly $9 per month, saying previously available features had become locked and general AI tools offered an alternative. That reviewer still liked the app's presentation and creative details. The useful signal is that perceived personalization can coexist with price resistance.")
source_line([("Co-Star App Store reviews", "costar")])
h("AstroClub reviews from 2024 and 2025", 2)
p("A 22 March 2025 paying reviewer described the app as expensive but worthwhile for insight and guidance, especially AI tarot, while criticizing chart errors and changes in conversational personality. A 29 May 2024 reviewer said the AI felt helpful but reported another payment request after buying a $40 annual plan. Continuity and dependable recognition of a purchase form part of the customer's value judgment; $40 is a historical reported price.")
source_line([("AstroClub App Store reviews", "astroclub")])
h("Astrojiva feedback from March 2026", 2)
p("In a developer-started Reddit thread on 22 to 24 March 2026, one user objected that follow-up questions on the same topic consumed credits. Another reported paying twice because the service was intriguing and affordable, but raised inconsistent answers and a three-credit trial. The developer offered additional free credits in the thread. This small, promotion-adjacent sample supports making clarification and deduction rules explicit.")
source_line([("Astrojiva customer feedback on Reddit", "jiva")])
h("Report value discussions from 2021 to 2026", 2)
p("On 30 May 2025, a Reddit comparison considered paid synastry aspect descriptions poor value because similar descriptions were free, while valuing an Astrodienst forecast at roughly $27 for its depth. That dated estimate is distinct from the current official USD 26.90 or EUR 26.90 offer. On 11 March 2021, a buyer praised a $65, 23-page Liz Greene PDF for readability; an October 2024 discussion also praised her automated reports.")
source_line([("2025 report comparison", "calculators"), ("Current forecast price", "forecast"), ("2021 buyer", "greene2021"), ("2024 discussion", "greene2024")])
p("On 24 March 2026, a customer reported paying over $150 for a 100-plus-page reading they believed was generic AI writing, saying fewer pages of specific analysis would have been preferable. AI authorship is the customer's unverified allegation. The decision-relevant point is that length alone did not satisfy the buyer's expectation of personal analysis.")
source_line([("2026 report dissatisfaction discussion", "pdfcomplaint")])

# A restrained page number assists navigation in a multi-page research report.
footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
footer.paragraph_format.space_after = Pt(0)
run = footer.add_run("Natally research  |  ")
run.font.size = Pt(8)
run.font.color.rgb = RGBColor(0, 0, 0)
field = OxmlElement("w:fldSimple")
field.set(qn("w:instr"), "PAGE")
footer._p.append(field)

props = doc.core_properties
props.title = "Natally pricing and package research"
props.subject = "AI astrology monthly plans prepaid topups and natal and synastry report keepsakes"
props.author = "Natally research"
props.keywords = "Natally, pricing, astrology, monthly plans, credits, PDF, synastry, 2026"
props.comments = "Dated research artifact with source hyperlinks"
props.created = datetime.now(timezone.utc)
props.modified = props.created
doc.save(OUTPUT)
print(OUTPUT)
