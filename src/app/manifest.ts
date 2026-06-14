import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Čeka se devojčica",
    short_name: "Devojčica",
    description: "Porodični kutak: glasanje za ime, tipovanje i želje za bebu.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF7F2",
    theme_color: "#FDF7F2",
    lang: "sr-Latn",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
