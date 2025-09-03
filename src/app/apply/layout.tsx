import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0C0D0E] [--border:0_0%_15%] [--card-foreground:0_0%_100%] [--card:0_0%_15%] [--muted:0_0%_15%]">
      {children}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
