import { GlobalSettings } from "@/app/page";
import { ProcessingResult, SignGloss, SafetyResult, Sign } from "./types";

const CRISIS_RESOURCES = [
  "National Suicide Prevention Lifeline: 988",
  "Crisis Text Line: Text HOME to 741741",
  "SAMHSA National Helpline: 1-800-662-4357",
];

const INAPPROPRIATE_PATTERNS = [
  /\b(kill|murder|attack|harm)\s+(myself|yourself|someone)\b/i,
  /\b(fucking|f\*ck|shit|bitch|asshole|c\*nt)\b/i,
  /\b(suicide|self-harm|end it all)\b/i,
];

const CRISIS_PATTERNS = [
  /\b(want to die|kill myself|end my life|suicide|self-harm)\b/i,
  /\b(no reason to live|better off dead)\b/i,
];

function checkSafety(text: string, safetyMode: boolean): SafetyResult | null {
  if (!safetyMode) return null;

  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(text)) {
      return {
        allowed: true,
        message: "Crisis language detected. Help is available.",
        resources: CRISIS_RESOURCES,
      };
    }
  }

  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        allowed: false,
        message: "Content filtered. Please use respectful language.",
      };
    }
  }

  return null;
}

function textToSignGloss(text: string, signLang: string): SignGloss {
  const words = text.trim().split(/\s+/);
  const signs: Sign[] = [];
  let structure: SignGloss["structure"] = "standard";
  const nonManualMarkers: string[] = [];

  const isQuestion = /\?$/.test(text) || /^(what|who|where|when|why|how|do|does|did|is|are|was|were|can|could|will|would)/i.test(text);
  const isNegation = /\b(not|no|never|don't|doesn't|didn't|won't|wouldn't|can't|couldn't)\b/i.test(text);

  if (isQuestion) {
    structure = "question";
    nonManualMarkers.push("brows-raised", "head-forward");
  }
  if (isNegation) {
    structure = "negation";
    nonManualMarkers.push("head-shake");
  }

  const stopWords = ["the", "a", "an", "to", "of", "and", "or", "but"];

  const signDict: Record<string, string> = {
    hello: "HELLO",
    hi: "HELLO",
    goodbye: "GOODBYE",
    bye: "GOODBYE",
    thank: "THANK-YOU",
    thanks: "THANK-YOU",
    please: "PLEASE",
    sorry: "SORRY",
    yes: "YES",
    no: "NO",
    what: "WHAT",
    who: "WHO",
    where: "WHERE",
    when: "WHEN",
    why: "WHY",
    how: "HOW",
    help: "HELP",
    need: "NEED",
    want: "WANT",
    like: "LIKE",
    love: "LOVE",
    eat: "EAT",
    drink: "DRINK",
    sleep: "SLEEP",
    work: "WORK",
    home: "HOME",
    school: "SCHOOL",
    friend: "FRIEND",
    family: "FAMILY",
    mother: "MOTHER",
    father: "FATHER",
    brother: "BROTHER",
    sister: "SISTER",
    happy: "HAPPY",
    sad: "SAD",
    angry: "ANGRY",
    tired: "TIRED",
    hungry: "HUNGRY",
    good: "GOOD",
    bad: "BAD",
    big: "BIG",
    small: "SMALL",
    hot: "HOT",
    cold: "COLD",
    today: "TODAY",
    tomorrow: "TOMORROW",
    yesterday: "YESTERDAY",
    now: "NOW",
    later: "LATER",
    time: "TIME",
    day: "DAY",
    night: "NIGHT",
    morning: "MORNING",
    afternoon: "AFTERNOON",
    evening: "EVENING",
    week: "WEEK",
    month: "MONTH",
    year: "YEAR",
    understand: "UNDERSTAND",
    know: "KNOW",
    think: "THINK",
    feel: "FEEL",
    see: "SEE",
    hear: "HEAR",
    speak: "SPEAK",
    sign: "SIGN",
    deaf: "DEAF",
    hearing: "HEARING",
    person: "PERSON",
    people: "PEOPLE",
    man: "MAN",
    woman: "WOMAN",
    child: "CHILD",
    baby: "BABY",
    dog: "DOG",
    cat: "CAT",
    car: "CAR",
    house: "HOUSE",
    food: "FOOD",
    water: "WATER",
    money: "MONEY",
    phone: "PHONE",
    computer: "COMPUTER",
    book: "BOOK",
    learn: "LEARN",
    teach: "TEACH",
    read: "READ",
    write: "WRITE",
    play: "PLAY",
    go: "GO",
    come: "COME",
    stay: "STAY",
    stop: "STOP",
    start: "START",
    finish: "FINISH",
    continue: "CONTINUE",
    wait: "WAIT",
    forget: "FORGET",
    remember: "REMEMBER",
    can: "CAN",
    cannot: "CANNOT",
    "can't": "CANNOT",
    will: "WILL",
    "won't": "WILL-NOT",
    do: "DO",
    "don't": "DON'T",
    does: "DO",
    "doesn't": "DON'T",
    did: "DID",
    "didn't": "DIDN'T",
    have: "HAVE",
    has: "HAVE",
    had: "HAD",
    is: "IS",
    am: "IS",
    are: "ARE",
    was: "WAS",
    were: "WERE",
    be: "BE",
    been: "BEEN",
    being: "BEING",
  };

  for (let word of words) {
    word = word.toLowerCase().replace(/[.,!?;:]$/g, "");

    if (stopWords.includes(word)) {
      continue;
    }

    if (signDict[word]) {
      signs.push({ sign: signDict[word] });
    } else {
      signs.push({
        sign: word.toUpperCase(),
        fingerspell: true,
        uncertain: true,
      });
    }
  }

  if (signs.length === 0) {
    signs.push({ sign: "UNKNOWN", uncertain: true });
  }

  return {
    signs,
    nonManualMarkers: nonManualMarkers.length > 0 ? nonManualMarkers : undefined,
    structure,
  };
}

export async function processSpeechToSign(
  text: string,
  settings: GlobalSettings
): Promise<ProcessingResult> {
  if (!text || text.trim().length === 0) {
    return {
      gloss: { signs: [], structure: "standard" },
      caption: "",
    };
  }

  const safetyResult = checkSafety(text, settings.safety_mode);

  if (safetyResult && !safetyResult.allowed) {
    return {
      gloss: { signs: [], structure: "standard" },
      caption: safetyResult.message || "Content filtered",
      safety: safetyResult,
    };
  }

  const gloss = textToSignGloss(text, settings.sign_lang);

  return {
    gloss,
    caption: text,
    safety: safetyResult || undefined,
  };
}
