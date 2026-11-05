/**
 * Deterministic, authored educational text for chart targets.
 * No network, no LLM, no audio: pure functions over calculated chart facts.
 */
import { resolveChartTarget, chartTargetLabel, isDatedSkyTarget } from './chartTargets';
import { ZODIAC_SIGNS, type NatalChartResult } from './ephemeris';

export type AuthoredExplanation = { title: string; text: string; targets: string[] };

const CONTEXT_LINE = 'Astrology is an interpretive tradition: these meanings grew over centuries as a symbolic language, not as proven predictions about any life.';
const OFFER_LINE = 'If you would like, we can keep exploring it together in a live conversation, or I can weave it into a personal reading you can keep.';

const sanitizeName = (raw: string): string =>
  (raw || '').replace(/[\x00-\x1F\x7F]/g, '').replace(/[\[\]{}<>()]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);

const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

type LessonCore = { what: string; trad: string; why: string; q: string; ancient?: boolean; modern?: boolean };

const BODIES: Record<string, LessonCore> = {
  Sun: {
    ancient: true,
    what: 'The Sun’s chart position marks where the brightest body in the sky stood against the zodiac.',
    trad: 'Ancient skywatchers gave the Sun the central role: it was read as the giver of light, vitality and sovereign identity.',
    why: 'The Sun’s daily rising and setting and its yearly drift through the zodiac are the sky’s most regular cycles, and later interpreters connected that steady rhythm with the idea of a stable core self around which a life is organized.',
    q: 'Where in an ordinary week do you feel most fully yourself?',
  },
  Moon: {
    ancient: true,
    what: 'The Moon’s chart position records where the nearest and fastest-moving light traveled through the zodiac.',
    trad: 'Traditional astrologers tied the Moon to rhythm, mood, memory and daily habit, the tide-like side of a person.',
    why: 'Later interpreters connected its visible behavior with feeling: the Moon waxes and wanes on a reliable monthly pulse and accompanies the tides, so it became the natural emblem of emotions that ebb, flow and return.',
    q: 'Which routines or places help you feel settled when the day has been long?',
  },
  Mercury: {
    ancient: true,
    what: 'Mercury’s chart position shows where the swiftest visible planet, the one that never strays far from the Sun, sat in the zodiac.',
    trad: 'Older traditions cast Mercury as the messenger: speech, trade, travel, wit and the joining of different minds.',
    why: 'Watchers of the sky noticed it darting between evening and morning sky faster than any other wanderer, a fitting picture for a symbol of words, routes and quick exchange.',
    q: 'How do you most like to learn and explain something new?',
  },
  Venus: {
    ancient: true,
    what: 'Venus marks the zodiacal place of the brightest planet, one that ancient people knew as both the evening star and the morning star.',
    trad: 'Tradition gave Venus the themes of attraction, beauty, affection and value, what a person cherishes and how they draw others near.',
    why: 'Later interpreters connected its gleaming, regular appearances at dusk and dawn with harmony and desire. Recorded omens around Venus actually varied between cultures, so this association is a symbolic tradition rather than a universal observation.',
    q: 'What ordinary beauty did you last stop to notice, and what drew you to it?',
  },
  Mars: {
    ancient: true,
    what: 'Mars’s chart position records where the visibly red planet stood in the zodiac.',
    trad: 'Ancient readings attached drive, courage, competition and heat to Mars, the spark that starts things.',
    why: 'Its uncommon red color and its strange habit of looping backward through the stars set it apart, and later interpreters read that restless motion as a symbol of will, friction and initiative.',
    q: 'When was the last time you fought for something that mattered to you?',
  },
  Jupiter: {
    ancient: true,
    what: 'Jupiter’s chart position marks where the largest visible planet, one of the brightest objects in the night sky, stood in the zodiac.',
    trad: 'Tradition made Jupiter the great benefic: growth, generosity, learning, travel and trust in life.',
    why: 'Ancient astronomers timed its slow, steady tour of the zodiac at roughly one sign each year, a patient, expansive circuit that suggested abundance, teaching and wide horizons.',
    q: 'What new horizon, big or small, is calling you to stretch a little?',
  },
  Saturn: {
    ancient: true,
    what: 'Saturn’s chart position marks where the slowest planet visible to the naked eye stood in the zodiac.',
    trad: 'Older texts gave Saturn the hard tasks: time, structure, limits, patience and the rewards of endurance.',
    why: 'Its leisurely thirty-year journey marked the boundary of the ancient-visible sky, and later interpreters read that slow pace as a symbol of rules, consequences and the wisdom that only long effort teaches.',
    q: 'Which long, unglamorous effort in your life has quietly taught you the most?',
  },
  Uranus: {
    modern: true,
    what: 'Uranus was the first planet found with a telescope, spotted in 1781, and its chart position marks where this later-discovered wanderer sat.',
    trad: 'Astrologers of later generations read Uranus as sudden change, invention and the shaking loose of old structures.',
    why: 'The association grew in the era of its discovery, an age of revolutions and rapid science, so its symbolism was drawn from the spirit of that time rather than from any ancient observation.',
    q: 'Where might a little healthy disruption actually free you?',
  },
  Neptune: {
    modern: true,
    what: 'Neptune was recognized as a planet in 1846: its position was predicted mathematically from irregularities in Uranus’s orbit, and it was then found close to that predicted spot. Its chart position marks that far planet’s place.',
    trad: 'Later astrologers gave Neptune the themes of imagination, dreams, compassion and the dissolving of hard edges.',
    why: 'Its symbolism was assigned in a century of photography, anesthetics and romantic art, so interpreters linked it to altered perception and oceanic feeling rather than to anything visible to the ancients.',
    q: 'What daydream of yours deserves a little more room to breathe?',
  },
  Pluto: {
    modern: true,
    what: 'Pluto was discovered in 1930 at the edge of the known solar system, and its chart position marks that distant body’s place.',
    trad: 'Modern astrologers read Pluto as deep change: what gets stripped away, transformed and renewed over a lifetime.',
    why: 'The association formed in the decade of its discovery, an age that uncovered hidden forces of matter and power, and interpreters extended that mood into a symbol of buried things rising to be changed.',
    q: 'What change in your life, once unwelcome, turned out to have remade you well?',
  },
  Chiron: {
    modern: true,
    what: 'Chiron, found in 1977, is a small comet-like body traveling between Saturn and Uranus, and its chart position marks where it sat.',
    trad: 'Late-twentieth-century astrologers named Chiron the wounded teacher: the sore place that becomes a source of skill and care for others.',
    why: 'Named for a mythic healer-teacher who could not heal himself, it was assigned a meaning about turning personal difficulty into hard-won wisdom, a modern layer rather than an ancient one.',
    q: 'What hard experience of yours has made you gentler or wiser with others?',
  },
  TrueNode: {
    what: 'The north lunar node is the point where the Moon’s tilted path crosses the Sun’s road through the zodiac, heading northward.',
    trad: 'Traditional astrologers watched these crossing points closely because eclipses occur near them, and eclipse symbolism carried meanings of interruption, darkening and revelation.',
    why: 'The modern reading of the northward node as a direction of growth and destiny is a later interpretation layered onto that eclipse symbolism; the classical sources themselves gave the nodes an eclipse meaning, not a universal story of fate.',
    q: 'What direction feels unfamiliar but quietly right to you?',
  },
  Ascendant: {
    what: 'The Ascendant is the zodiac degree rising on the eastern horizon at a given moment.',
    trad: 'Tradition read it as the doorway of the chart: appearance, first impressions and the lens through which a person meets the world.',
    why: 'It earned that role from geometry: it is the point where the sky physically meets the earth for that moment, so interpreters made it the symbol of the interface between a person and their surroundings.',
    q: 'What do you think people sense about you in the first minute, and is it accurate?',
  },
  Midheaven: {
    what: 'The Midheaven is the point where the ecliptic, the Sun’s yearly path, crosses the local meridian, the north–south line passing overhead, at its upper intersection.',
    trad: 'Older astrologers gave it the public summit: vocation, reputation and what a life is visibly known for.',
    why: 'Later interpreters connected that upper-meridian position with the most visible, public part of a life. It is a meridian crossing rather than the zenith or the highest point of the Sun’s arc, and in whole-sign or equal house systems the tenth house does not have to begin exactly at the Midheaven.',
    q: 'What would you love to be known for, ten years from now?',
  },
};

const HOUSE_SYSTEMS_CONTEXT = 'Houses are the numbered sectors of the chart wheel. Different house systems (whole sign, equal, quadrant-based) draw the sector boundaries by different conventions that varied between schools, so a house\u2019s starting degree depends on the system chosen; the first and seventh begin at the Ascendant and Descendant in quadrant and equal systems, and the fourth and tenth align with the IC and Midheaven in quadrant systems. These sectors are topic areas by convention, not fixed regions above or below the horizon.';

const HOUSE_CORES: LessonCore[] = [
  { what: 'The first house is the chart\u2019s first numbered sector, the sector of self and first impressions.', trad: 'Tradition placed self-image, the body and first impressions here.', why: 'The topics are an inherited convention passed between schools rather than a consequence of sky geometry; later interpreters connect this opening sector with how a life presents itself.', q: 'What first impression do you usually make, and do you like it?' },
  { what: 'The second house is the chart\u2019s second numbered sector.', trad: 'Older readings gave it money, possessions, talents and the sense of worth a person carries.', why: 'Later interpreters connect this sector with livelihood and what sustains the self; the numbering is a convention that varied by school, not a rule derived from the sky.', q: 'What skill or resource of yours do you most undervalue?' },
  { what: 'The third house is the chart\u2019s third numbered sector.', trad: 'Tradition read it as the near world: siblings, neighbors, short trips, letters and everyday speech.', why: 'Later interpreters connect the third sector with the everyday circles closest to home; the assignment is an inherited convention, not an observation about direction or place in the sky.', q: 'Who in your daily radius shapes your thinking more than you admit?' },
  { what: 'The fourth house is the chart\u2019s fourth numbered sector.', trad: 'Tradition placed home, ancestry, private foundations and endings here.', why: 'In quadrant systems its cusp is the IC, the lower meridian crossing; other systems simply count sectors from the first. The family symbolism is a later interpretive convention.', q: 'What does home mean to you beyond a place?' },
  { what: 'The fifth house is the chart\u2019s fifth numbered sector.', trad: 'Older texts gave it pleasure, romance, creativity, play and children.', why: 'Later interpreters connect this sector with what a person brings forth, an inherited symbolic assignment rather than a rule that follows from the house\u2019s position.', q: 'What playful thing did you love as a child that you could revisit?' },
  { what: 'The sixth house is the chart\u2019s sixth numbered sector.', trad: 'Tradition assigned it daily work, health routines, service and craft.', why: 'Later interpreters read this sector as the ordinary machinery of life, the habits that hold a body and schedule together; the meaning was handed down between schools as convention.', q: 'Which small daily habit helps or hinders you most?' },
  { what: 'The seventh house is the chart\u2019s seventh numbered sector, the sector of partnership.', trad: 'Tradition read it as partnership: marriage, contracts, close others and the mirror of relationship.', why: 'It sits opposite the first sector on the wheel, and later interpreters made that opposition the symbol of the significant other; the pairing is an interpretive convention, not a physical property of the sky.', q: 'What do your closest relationships reflect back at you?' },
  { what: 'The eighth house is the chart\u2019s eighth numbered sector.', trad: 'Older readings gave it shared resources, intimacy, inheritance and deep change.', why: 'Later interpreters connect it, opposite the sector of personal possessions, with what is shared and transformed with others; the assignment is inherited convention.', q: 'Where in life are you ready to let something change form?' },
  { what: 'The ninth house is the chart\u2019s ninth numbered sector.', trad: 'Tradition assigned it long journeys, higher study, philosophy and belief.', why: 'Later interpreters connect this sector with distance, learning and the widening of a worldview, a meaning handed down as convention rather than derived from sky geometry.', q: 'Which belief of yours has changed most in the last five years?' },
  { what: 'The tenth house is the chart\u2019s tenth numbered sector, the sector of vocation and public standing.', trad: 'Tradition gave it calling, public standing, vocation and legacy.', why: 'In quadrant systems its cusp is the Midheaven; whole-sign and equal systems count it as the tenth sector from the first, so its starting degree varies by system. The public symbolism is a later interpretive convention.', q: 'What contribution would you like your work to make?' },
  { what: 'The eleventh house is the chart\u2019s eleventh numbered sector.', trad: 'Older texts read it as friendships, groups, hopes and long-range wishes.', why: 'Later interpreters connect it with the community and alliances gathered around a life\u2019s aims, an inherited convention rather than a rule of the sky.', q: 'Which friendship or community quietly holds your hopes?' },
  { what: 'The twelfth house is the chart\u2019s twelfth numbered sector, the last before the wheel returns to the first.', trad: 'Tradition placed it as the hidden room: solitude, dreams, retreat and what works beneath awareness.', why: 'Later interpreters connect this closing sector with the inner and the unspoken; the placement and meaning are conventions that varied between schools, not descriptions of above or below the horizon.', q: 'What helps you recharge when you are truly alone?' },
];

const SIGN_CORES: Record<string, LessonCore> = {
  Aries: { what: 'Aries begins the zodiac at the spring equinox point: the first of the three fire signs, of cardinal quality.', trad: 'Tradition read Aries as initiative: the spark, the first move, the willingness to begin.', why: 'Starting the yearly circuit at the equinox, when light overtakes dark, made it the natural emblem of new beginnings and boldness.', q: 'What beginning of yours is waiting for a first bold step?' },
  Taurus: { what: 'Taurus is the fixed earth sign of late spring, the season of steady growth.', trad: 'Tradition gave it patience, substance, sensuality and steadfastness.', why: 'Placed in the deep-soil middle of spring, it came to symbolize what is built slowly and kept reliably.', q: 'What in your life deserves more steady, unhurried attention?' },
  Gemini: { what: 'Gemini is the mutable air sign closing spring, the sign of the twins.', trad: 'Tradition read it as curiosity, conversation, versatility and the quick linking of ideas.', why: 'Marking the change of seasons, its twin symbol suited the switching, many-minded energy interpreters gave it.', q: 'Which two sides of you most enjoy a good conversation?' },
  Cancer: { what: 'Cancer is the cardinal water sign opening summer, beginning at the solstice.', trad: 'Tradition gave it nurture, memory, shelter and fierce care for what it loves.', why: 'Arriving at the year\u2019s brightest turning point, it was tied to hearth and tide, the protective home of feeling.', q: 'How do you best care for the people you love?' },
  Leo: { what: 'Leo is the fixed fire sign of high summer, ruled in tradition by the Sun.', trad: 'Tradition read it as radiance: creativity, generosity, play and warm self-expression.', why: 'Holding the season of strongest light, it became the natural emblem of the shining, sovereign heart.', q: 'What creative spark of yours deserves an audience?' },
  Virgo: { what: 'Virgo is the mutable earth sign closing summer, the season of the harvest.', trad: 'Tradition gave it discernment, craft, service and careful refinement.', why: 'Marking harvest time, when grain is sorted and sorted again, it came to symbolize discrimination, usefulness and skill.', q: 'What are you quietly getting better at, piece by piece?' },
  Libra: { what: 'Libra is the cardinal air sign beginning at the autumn equinox, the scales.', trad: 'Tradition read it as balance: fairness, partnership, beauty and measured judgment.', why: 'Beginning when day and night stand equal, it was a natural emblem of weighing two sides and finding accord.', q: 'Where in your life are you seeking a fairer balance?' },
  Scorpio: { what: 'Scorpio is the fixed water sign of deep autumn.', trad: 'Tradition gave it depth: intensity, loyalty, transformation and the courage to look at what is hidden.', why: 'Holding the season of deepening dark, interpreters tied it to what goes beneath the surface and returns changed.', q: 'What truth about yourself have you only recently made peace with?' },
  Sagittarius: { what: 'Sagittarius is the mutable fire sign closing autumn, the archer aiming outward.', trad: 'Tradition read it as the seeker: travel, philosophy, humor and faith in the wider view.', why: 'Aiming across the turn of the year, it became the emblem of the long horizon and the search for meaning.', q: 'What big question keeps pulling your aim outward?' },
  Capricorn: { what: 'Capricorn is the cardinal earth sign beginning at the winter solstice.', trad: 'Tradition gave it ambition, discipline, endurance and the building of lasting things.', why: 'Starting the year\u2019s darkest climb back toward light, it symbolized patient ascent and achievement earned step by step.', q: 'What long climb of yours is worth every careful step?' },
  Aquarius: { what: 'Aquarius is the fixed air sign of deep winter.', trad: 'Tradition read it as the visionary: friendship, ideals, invention and loyalty to the collective.', why: 'Holding midwinter with cool clarity, interpreters gave it the picture of ideas and fellowship that outlast the season.', q: 'Which ideal of yours would you defend even when it is unpopular?' },
  Pisces: { what: 'Pisces is the mutable water sign closing the zodiac at winter\u2019s end.', trad: 'Tradition gave it imagination, empathy, art and the soft dissolving of boundaries.', why: 'Ending the yearly circuit at the edge of spring, it became the emblem of release, dreaming and the tide before renewal.', q: 'Where does your imagination take you when no one is asking?' },
};

const ASPECT_CORES: Record<string, LessonCore> = {
  Conjunction: { what: 'A conjunction occurs when two chart points share nearly the same ecliptic longitude, standing in the same zodiac degree.', trad: 'Tradition read it as a blending: the two symbols speak with one voice, for warmth or for intensity.', why: 'Because the pair share one zodiacal place, interpreters treated the conjunction as the strongest and most fusing of the aspects; the bodies need not appear visually merged, since their ecliptic latitudes can differ.', q: 'Where do two sides of you speak with a single voice?' },
  Opposition: { what: 'An opposition joins two chart points sitting opposite each other, about half the circle apart.', trad: 'Tradition read it as a see-saw: two poles pulling at each other, asking for balance rather than victory.', why: 'The geometry of facing positions across the wheel suggested confrontation and the search for a middle point.', q: 'Which two pulls in your life are asking you to find the middle?' },
  Square: { what: 'A square links two chart points about a quarter of the circle apart, at right angles.', trad: 'Tradition read it as friction: a challenge that demands action and, worked with honestly, builds strength.', why: 'The hard right angle of the geometry gave early astrologers a picture of obstacles and productive strain.', q: 'What recurring challenge of yours has quietly made you stronger?' },
  Trine: { what: 'A trine connects two chart points a third of the circle apart, often in the same element.', trad: 'Tradition read it as easy flow: talents that arrive without strain, lucky alignments of temperament.', why: 'Same-element thirds share an element in the zodiac, which made interpreters see natural harmony and unforced support.', q: 'Which of your talents feels so natural you forget it is one?' },
  Sextile: { what: 'A sextile joins two chart points a sixth of the circle apart, about sixty degrees.', trad: 'Tradition read it as friendly opportunity: a gentle nudge that works when the person says yes to it.', why: 'Its mild angle suggested acquaintance rather than intensity, an aspect of open doors rather than pushing hands.', q: 'What easy opportunity is waiting for your yes?' },
};

const GENERAL_TITLE = 'How a chart is read';
const GENERAL_LESSON: LessonCore = {
  what: 'A birth chart is a snapshot of the sky, and the sky alone: where the visible and calculated points stood at one moment, mapped onto the zodiac and the houses. Reading it means comparing those calculated positions with an inherited symbolic vocabulary that astrologers have compiled over centuries.',
  trad: 'That vocabulary began with the seven wandering lights visible to the naked eye, and each planet carried the character ancient observers gave it. Signs colored the expression, houses located it in a department of life, and aspects described the angles between points.',
  why: 'The system grew by observation first and interpretation second: watchers tracked real cycles in the sky, then gradually attached meanings that seemed to fit those rhythms, a tradition built by hand over many generations.',
  q: 'Which part of this symbolic language are you most curious to look at first?',
};

const HOUSE_TOPICS: Array<{ name: string; domain: string }> = [
  { name: 'identity', domain: 'self and first impressions' },
  { name: 'resources', domain: 'money, talents and worth' },
  { name: 'kin', domain: 'kin, neighbors and everyday talk' },
  { name: 'roots', domain: 'home, family and private foundations' },
  { name: 'creation', domain: 'play, romance and creative works' },
  { name: 'craft', domain: 'daily work, health and routines' },
  { name: 'partnership', domain: 'partners and close one-to-one bonds' },
  { name: 'depths', domain: 'intimacy, shared resources and change' },
  { name: 'horizons', domain: 'travel, study and belief' },
  { name: 'summit', domain: 'vocation and public standing' },
  { name: 'collective', domain: 'friends, groups and long hopes' },
  { name: 'sanctuary', domain: 'solitude, dreams and the inner life' },
];

function buildLesson(
  title: string,
  core: LessonCore,
  facts: string,
  nameSentence: string,
  targets: string[]
): AuthoredExplanation {
  const ancientLine = core.ancient
    ? ' This is one of the seven classical planets, watched and named thousands of years before telescopes existed.'
    : core.modern
      ? ' This is a modern discovery: no ancient astrologer knew it existed, and its meaning is a later symbolic assignment, not an ancient tradition.'
      : '';
  const intro = `${nameSentence}${facts ? ' ' + facts : ''} ${core.what}${ancientLine} ${CONTEXT_LINE}`;
  const middle = `${core.trad} ${core.why}`;
  const closing = `As you sit with this, try it on rather than take it on faith: ${core.q} ${OFFER_LINE}`;
  return { title, text: [intro, middle, closing].join('\n\n'), targets };
}

function bodyFacts(chart: NatalChartResult, bodyName: string): string {
  const body = chart.natalBodies.find(candidate => candidate.name === bodyName);
  if (!body) return '';
  if (chart.input.birthTimeUnknown) {
    const moonNote = bodyName === 'Moon'
      ? ' The Moon moves quickly, so its exact birth degree could be several degrees away from the value shown.'
      : '';
    return `Because the birth time is unknown, this chart is calculated for noon as an approximation.${moonNote} Houses and angles cannot be determined without a birth time.`;
  }
  const facts = [`Your ${body.name} sits at ${body.fullDegText}`];
  if (Number.isFinite(body.house) && body.house >= 1 && body.house <= 12) {
    facts.push(`in your ${ordinal(body.house)} house`);
  }
  return facts.join(' ') + '.';
}

function resolveDatedTarget(chart: NatalChartResult, canonical: string): { name: string; facts: string } | null {
  if (!isDatedSkyTarget(canonical) || !chart.currentSky) return null;
  const body = chart.currentSky.bodies.find(candidate => candidate.target === canonical);
  const observed = new Date(chart.currentSky.observedAt);
  const observedText = Number.isFinite(observed.getTime()) ? observed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : chart.currentSky.observedAt;
  if (body) {
    const natal = chart.natalBodies.find(candidate => candidate.name === body.name);
    const natalApproximate = body.name === 'Moon' && chart.input.birthTimeUnknown;
    const natalText = natal && !natalApproximate
      ? `, whereas your natal ${body.name} sits at ${natal.fullDegText}`
      : natalApproximate
        ? ', whereas your natal Moon position is an approximation because the birth time is unknown'
        : '';
    return { name: body.name, facts: `As observed at ${observedText}, ${body.name} is at ${body.fullDegText} in the current sky${natalText}. The sky keeps moving; today's position and your birth position are two different photographs, not one placement.` };
  }
  const aspect = chart.currentSky.aspects.find(candidate => candidate.name === canonical);
  if (aspect) {
    const fromBody = chart.currentSky.bodies.find(candidate => candidate.target === aspect.from);
    return { name: aspect.type, facts: `As observed at ${observedText}, ${fromBody?.name ?? chartTargetLabel(aspect.from)} forms a ${aspect.type.toLowerCase()} with your natal ${chartTargetLabel(aspect.to)} (within ${Math.abs(aspect.orb).toFixed(1)}°). This is a temporary sky relationship, not a natal one.` };
  }
  return null;
}

export function getAuthoredChartExplanation(chart: NatalChartResult, target?: string): AuthoredExplanation {
  const name = sanitizeName(chart.input.name);
  const nameSentence = name ? `${name}, here is the lesson you asked about.` : 'Here is the lesson you asked about.';
  const canonical = target ? resolveChartTarget(target, chart) : null;
  if (!canonical) {
    return buildLesson(GENERAL_TITLE, GENERAL_LESSON, '', nameSentence, []);
  }
  const label = chartTargetLabel(canonical);

  const dated = resolveDatedTarget(chart, canonical);
  if (dated) {
    const core = BODIES[dated.name] ?? ASPECT_CORES[dated.name] ?? GENERAL_LESSON;
    return buildLesson(`Now: ${label}`, core, dated.facts, nameSentence, [canonical]);
  }

  const natalBody = chart.natalBodies.find(candidate => candidate.name === canonical || candidate.name === label);
  if (natalBody) {
    const core = BODIES[natalBody.name] ?? BODIES[label] ?? null;
    if (core) {
      return buildLesson(`${natalBody.name} in your chart`, core, bodyFacts(chart, natalBody.name), nameSentence, [canonical]);
    }
  }

  const sign = ZODIAC_SIGNS.find(candidate => candidate.name === label || candidate.name === canonical);
  if (sign) {
    const facts = 'Seasonal imagery here comes from the tropical zodiac\u2019s northern-hemisphere origins; the constellations and the local seasons where you live do not match these labels one-to-one.';
    return buildLesson(`${sign.name}, the ${sign.element} sign`, SIGN_CORES[sign.name], facts, nameSentence, [canonical]);
  }

  const houseMatch = /House (\d{1,2})$/i.exec(canonical);
  if (houseMatch) {
    const num = Number(houseMatch[1]);
    if (num >= 1 && num <= 12 && !chart.input.birthTimeUnknown) {
      const topic = HOUSE_TOPICS[num - 1];
      const core = HOUSE_CORES[num - 1];
      return buildLesson(`Your ${ordinal(num)} house`, core, `${HOUSE_SYSTEMS_CONTEXT} Tradition files the ${topic.domain} here.`, nameSentence, [canonical]);
    }
  }

  const aspect = chart.aspectChords.find(candidate => candidate.name === canonical);
  if (aspect) {
    const core = ASPECT_CORES[aspect.type] ?? GENERAL_LESSON;
    const fromBody = chart.natalBodies.find(candidate => candidate.name === aspect.from);
    const toBody = chart.natalBodies.find(candidate => candidate.name === aspect.to);
    const facts = `In your chart, ${aspect.from} ${aspect.type.toLowerCase()} ${aspect.to} (within ${Math.abs(aspect.orb).toFixed(1)}°)${fromBody ? `, with ${aspect.from} at ${fromBody.fullDegText}` : ''}${toBody ? ` and ${aspect.to} at ${toBody.fullDegText}` : ''}.`;
    return buildLesson(`${aspect.from} ${aspect.type.toLowerCase()} ${aspect.to}`, core, facts, nameSentence, [canonical]);
  }

  if (!chart.input.birthTimeUnknown && /^House \d{1,2}$/i.test(label)) return buildLesson(GENERAL_TITLE, GENERAL_LESSON, '', nameSentence, []);
  return buildLesson(GENERAL_TITLE, GENERAL_LESSON, '', nameSentence, []);
}

export function getAuthoredConversationClose(name: string): AuthoredExplanation {
  const safe = sanitizeName(name);
  const greeting = safe ? `${safe}, ` : '';
  const text = [
    `${greeting}I would love to keep going with you, and there are two ways to do that. I can sit with you in a longer guided conversation, where we wander through whatever is on your mind and look at it through your chart together, question by question.`,
    'Or I can compose a personal keepsake reading: a full, written piece about your sky that you can keep, reread and return to whenever you like. Each of these is prepared with real care rather than a quick answer, which is why they are part of the paid offerings; the live quote at checkout shows the current price before you decide anything.',
    'Meanwhile, the free chart right here is still rich: click any planet, sign, house or aspect and I will teach you what the tradition says about it. What would you like to explore together first?',
  ].join('\n\n');
  return { title: 'Explore with Natally', text, targets: [] };
}
