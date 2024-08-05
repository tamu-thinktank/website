import { env } from "@/env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: env.WEB_URL,
    sitemap: `${env.WEB_URL}/sitemap.xml`,
  };
}
