/** Unlockable basketball skins. Purely recolored SVG — no image assets. */
export interface BallSkin {
  id: string;
  name: string;
  price: number; // coins
  grad: [string, string, string, string]; // radial-gradient stops (light → dark)
  seam: string; // seam line color
}

export const BALLS: BallSkin[] = [
  { id: "classic", name: "Classic Leather", price: 0, grad: ["#ffd9a8", "#f4951f", "#cf6416", "#8a3c0b"], seam: "#3d1c05" },
  { id: "knicks", name: "Bing Bong Blue", price: 150, grad: ["#cfe0ff", "#4b86d6", "#1f5bb0", "#0a2e63"], seam: "#0a1e40" },
  { id: "inferno", name: "Garden Fire", price: 250, grad: ["#ffd0a0", "#ff7a2f", "#e0330f", "#7a1405"], seam: "#4a0d02" },
  { id: "mint", name: "Ice Cold", price: 300, grad: ["#d9fff2", "#67e0c0", "#1f9e85", "#0a5c49"], seam: "#063a2d" },
  { id: "gold", name: "Championship Gold", price: 450, grad: ["#fff2c9", "#f7d264", "#d9a021", "#8a5e0c"], seam: "#5c3f06" },
  { id: "midnight", name: "Midnight", price: 600, grad: ["#9fb4dd", "#3f5f9e", "#22335f", "#0c1428"], seam: "#070d1c" },
];

export const ballById = (id: string): BallSkin =>
  BALLS.find((b) => b.id === id) ?? BALLS[0];
