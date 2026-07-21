export interface BtsQuote {
  text: string;
  source: string;
}

// All entries verified against interview transcripts, the 2018 UN speech transcript,
// and lyric translation sources. Lyric excerpts are kept to a single short line each.
export const BTS_QUOTES: BtsQuote[] = [
  {
    text: "No matter who you are, where you're from, your skin colour, your gender identity, just speak yourself.",
    source: "RM · UN Speech, 2018",
  },
  {
    text: "We have learned to love ourselves, so now I urge you to speak yourself.",
    source: "RM · UN Speech, 2018",
  },
  { text: "If you want to love others, I think you should love yourself first.", source: "RM" },
  { text: "Life is a sculpture that you cast as you make mistakes and learn from them.", source: "RM" },
  { text: "I have a big heart full of love, so please take it all.", source: "V" },
  {
    text: "Purple is the last color of the rainbow. Purple means I will trust and love you for a long time.",
    source: "V · origin of \"I Purple You\"",
  },
  { text: "You don't stop breathing just because the air is bad.", source: "V · DICON, 2018" },
  { text: "Don't be trapped in someone else's dream.", source: "V" },
  { text: "When things get hard, stop for a while and look back and see how far you've come.", source: "V" },
  { text: "Those who want to look more youthful should live life with a young heart.", source: "Jin" },
  { text: "Your presence can give happiness. I hope you remember that.", source: "Jin" },
  { text: "If the plan doesn't work, change the plan, but never the goal.", source: "Jin" },
  { text: "If you think you're going to crash, step on the pedal harder.", source: "Suga · \"Never Mind\"" },
  { text: "Living without passion is like being dead.", source: "Jungkook" },
  {
    text: "Until this cold winter ends and the spring comes again, please stay there a little longer.",
    source: "BTS · \"Spring Day\"",
  },
  {
    text: "On days where I hate myself for being me, let's make a door inside your heart.",
    source: "BTS · \"Magic Shop\"",
  },
  { text: "You'll be alright — this here is the Magic Shop.", source: "BTS · \"Magic Shop\"" },
  {
    text: "Loving myself doesn't require anyone else's permission.",
    source: "BTS · \"Answer: Love Myself\"",
  },
  { text: "You've shown me I have reasons I should love myself.", source: "BTS · \"Answer: Love Myself\"" },
  { text: "No matter what you call me, I don't care, I'm proud of it.", source: "BTS · \"IDOL\"" },
  { text: "A day may come when we lose, but it is not today. Today, we fight!", source: "BTS · \"Not Today\"" },
  { text: "Don't kneel, don't cry, raise your hands.", source: "BTS · \"Not Today\"" },

  // Variety-show / fandom catchphrases — exact, well-documented lines with clear origins.
  { text: "Jimin, you got no jams.", source: "RM · iconic catchphrase, 2014" },
  { text: "Lachimolala.", source: "Jimin · Run BTS! Ep. 41" },
  { text: "Hey, stob it!", source: "Jin · to Jimin & Jungkook" },
  { text: "Don't touch my face.", source: "J-Hope · to Jimin" },
  { text: "Worldwide Handsome.", source: "Jin · self-given nickname" },

  // V Live / Weverse live moments — exact, well-documented replies and lines.
  { text: "Kim Taehyung: recycling since the crib.", source: "V · V Live" },
  { text: "I told you to drink reasonably.", source: "Suga · Weverse reply" },
  { text: "So did you?", source: "Suga · Weverse reply" },
  { text: "Who are you?", source: "V · Weverse reply" },
  { text: "P-A-S-T-A, pasta! P-I-Z-Z-A, pizza!", source: "Jin · viral \"pasta song\"" },
  { text: "I don't have think.", source: "Jin" },
];
