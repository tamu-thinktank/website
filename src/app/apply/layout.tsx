export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0C0D0E] [--card:0_0%_15%] [--card-foreground:0_0%_100%]">
      {children}
    </div>
  );
}
