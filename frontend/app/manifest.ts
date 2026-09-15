import type { MetadataRoute } from "next";

/** Add to Home Screen: installable, standalone, Knicks navy + orange. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MSG · The Mecca, in app form",
    short_name: "MSG",
    description:
      "A New York Knicks shrine: facts, games, MSG Hoops, and the 2026 championship.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#040e26",
    theme_color: "#040e26",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      {
        src: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
        purpose: "maskable",
      },
    ],
  };
}
