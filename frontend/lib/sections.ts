/** The one source of truth for where everything lives in the building. */
export const SECTIONS = [
  { href: "/roulette", n: "01", title: "Fact Roulette", spot: "Center court", thumb: "/photos/the_garden_under_confetti.jpg", does: "Press one button, get a Knicks fact. Rare pulls rain confetti.", verb: "Spin" },
  { href: "/gauntlet", n: "02", title: "The Gauntlet", spot: "Left paint", thumb: "/photos/comeback_kids_june_13.jpg", does: "10 trivia questions. Right answers get praised, wrong ones get roasted.", verb: "Play" },
  { href: "/ragebait", n: "03", title: "Rage Bait", spot: "Right paint", thumb: "/photos/champs_front_page.jpg", does: "Hot takes built to end group chats. Rage levels certified.", verb: "Generate" },
  { href: "/trashtalk", n: "04", title: "Trash Talk", spot: "Left corner", thumb: "/photos/brunson_hears_the_garden.jpg", does: "Pick any of the other 29 teams. Receive ammunition.", verb: "Fire" },
  { href: "/faith", n: "05", title: "The Faith", spot: "The tunnel", thumb: "/photos/reed_19_brunson_11.jpg", does: "The whole story, 1946 to the parade. For fans and the unconverted.", verb: "Read" },
  { href: "/championship", n: "06", title: "Chip '26", spot: "Right corner", thumb: "/photos/kat_kisses_the_trophy.jpg", does: "The run, the art, and every parade photo. The reward at the end.", verb: "Relive" },
] as const;

export type Section = (typeof SECTIONS)[number];

export function sectionFor(path: string): Section | undefined {
  return SECTIONS.find((s) => s.href === path);
}
