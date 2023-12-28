export default function PurpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className={`flex h-screen items-center justify-center bg-gradient-to-r from-[#2e026d] to-[#15162c]`}
    >
      {children}
    </main>
  );
}
