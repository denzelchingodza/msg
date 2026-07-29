/** Unlockable court themes: reskin the floor, lines, and wall tint. */
export interface CourtTheme {
  id: string;
  name: string;
  price: number;
  wood: [string, string, string]; // floor gradient: far (top) -> near (bottom)
  line: string; // court line color
  key: string; // painted-key color
  wall: string; // wall tint overlay (rgba, sits over the brick)
  spot: string; // spotlight glow color (rgba)
}

export const COURTS: CourtTheme[] = [
  {
    id: "garden",
    name: "The Garden",
    price: 0,
    wood: ["#6b3f1d", "#a4652e", "#c98443"],
    line: "#f7fafe",
    key: "#0e3a76",
    wall: "transparent",
    spot: "rgba(180, 214, 255, 0.28)",
  },
  {
    id: "retro90",
    name: "Retro '90s",
    price: 500,
    wood: ["#5a3a22", "#8a5a34", "#b07a44"],
    line: "#ffd9a8",
    key: "#7a2fb0",
    wall: "rgba(60, 20, 90, 0.32)",
    spot: "rgba(230, 190, 255, 0.3)",
  },
  {
    id: "hardwood",
    name: "Blonde Hardwood",
    price: 700,
    wood: ["#b07a3e", "#d6a35c", "#eac583"],
    line: "#3a2410",
    key: "#c85a10",
    wall: "rgba(140, 90, 40, 0.24)",
    spot: "rgba(255, 226, 170, 0.32)",
  },
  {
    id: "midnight",
    name: "Midnight Blacktop",
    price: 900,
    wood: ["#141c30", "#26324e", "#3a4a6e"],
    line: "#9fc0ff",
    key: "#0a5c9e",
    wall: "rgba(8, 18, 44, 0.5)",
    spot: "rgba(120, 170, 255, 0.28)",
  },
  {
    id: "inferno",
    name: "Garden Fire",
    price: 1200,
    wood: ["#3a1408", "#7a2810", "#b0451c"],
    line: "#ffd0a0",
    key: "#e0330f",
    wall: "rgba(90, 20, 10, 0.4)",
    spot: "rgba(255, 150, 90, 0.3)",
  },
  {
    id: "gold",
    name: "Championship Gold",
    price: 1800,
    wood: ["#5c4410", "#9c7a1c", "#d6ad3a"],
    line: "#fff2c9",
    key: "#8a5e0c",
    wall: "rgba(120, 90, 20, 0.34)",
    spot: "rgba(255, 236, 170, 0.36)",
  },
];

export const courtById = (id: string): CourtTheme =>
  COURTS.find((c) => c.id === id) ?? COURTS[0];
