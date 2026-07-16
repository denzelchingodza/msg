/** The one source of truth for where everything lives in the building. */
export const SECTIONS = [
  { href: "/roulette", n: "01", title: "Fact Roulette", spot: "Center court", thumb: "/photos/the_garden_under_confetti.jpg", does: "Press one button, get a Knicks fact. Rare pulls rain confetti.", verb: "Spin" },
  { href: "/gauntlet", n: "02", title: "The Gauntlet", spot: "Left paint", thumb: "/photos/comeback_kids_june_13.jpg", does: "10 trivia questions. Right answers get praised, wrong ones get roasted.", verb: "Play" },
  { href: "/buzzer", n: "03", title: "Beat the Buzzer", spot: "Baseline", thumb: "/photos/rising_at_the_rim.jpg", does: "Rapid-fire trivia against a 60-second clock. How many can you drain?", verb: "Race" },
  { href: "/hoops", n: "04", title: "MSG Hoops", spot: "Center court", thumb: "/photos/rising_at_the_rim.jpg", does: "Flick to shoot. 60-second race vs a rival, streaks, and a moving rim when you're hot.", verb: "Ball" },
  { href: "/ragebait", n: "05", title: "Rage Bait", spot: "Right paint", thumb: "/photos/champs_front_page.jpg", does: "Hot takes built to end group chats. Rage levels certified.", verb: "Generate" },
  { href: "/trashtalk", n: "06", title: "Trash Talk", spot: "Left corner", thumb: "/photos/brunson_hears_the_garden.jpg", does: "Pick any of the other 29 teams. Receive ammunition.", verb: "Fire" },
  { href: "/faith", n: "07", title: "The Faith", spot: "The tunnel", thumb: "/photos/reed_19_brunson_11.jpg", does: "The whole story, 1946 to the parade. For fans and the unconverted.", verb: "Read" },
  { href: "/championship", n: "08", title: "Chip '26", spot: "Right corner", thumb: "/photos/kat_kisses_the_trophy.jpg", does: "The run, the art, and every parade photo. The reward at the end.", verb: "Relive" },
] as const;

export type Section = (typeof SECTIONS)[number];

export function sectionFor(path: string): Section | undefined {
  return SECTIONS.find((s) => s.href === path);
}
