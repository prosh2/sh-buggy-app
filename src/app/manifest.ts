import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Buggy by prosh2",
    short_name: "Buggy",
    description: "Buggy - Split your bills with friends easily!",
    start_url: "/",
    display: "standalone",
    background_color: "oklch(21% .034 264.665)",
    theme_color: "oklch(21% .034 264.665)",
    icons: [
      {
        src: "/opengraph-image.png",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
