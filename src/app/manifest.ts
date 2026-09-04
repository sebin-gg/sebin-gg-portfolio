import type { MetadataRoute } from "next";
import { profile } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Portfolio`,
    short_name: profile.name,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#090d16",
    theme_color: "#090d16",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
