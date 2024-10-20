import Container from "../../components/Container";

interface BenefitBoxProps {
  title: string;
}

function BenefitBox({ title }: BenefitBoxProps) {
  const words = title.split(" ");
  const firstWord = words[0]; // Get the first word
  const lastThreeWords = words.slice(-3).join(" "); // Get the last three words
  const middleWords = words.slice(1, -3).join(" "); // Get the words in between

  return (
    <div className="group relative">
      {/* Background highlight effect */}
      <div className="absolute inset-0 bg-white opacity-0 blur-xl transition-opacity duration-300 ease-in-out group-hover:opacity-10"></div>

      {/* Main component */}
      <div className="relative z-10 h-96 overflow-hidden rounded-2xl bg-[#1A1A1A] p-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-[#535151] opacity-50"></div>
        <div className="relative z-20 flex h-full flex-col">
          <div className="absolute inset-x-2 top-2 h-2/3 overflow-hidden rounded-lg transition-all duration-700 ease-in-out group-hover:inset-x-[-10%] group-hover:top-[-15%] group-hover:h-[85%] group-hover:rounded-b-none group-hover:rounded-t-2xl">
            <div className="h-full w-full bg-gray-700 transition-transform duration-500 ease-in-out group-hover:scale-150"></div>
          </div>
          <h3 className="mt-auto pb-4 pl-6 text-left text-2xl font-semibold text-white">
            <span className="block font-normal">{firstWord}</span>{" "}
            {/* First word regular */}
            <span className="block font-normal">{middleWords}</span>{" "}
            {/* Middle words normal */}
            <span className="block font-semibold">{lastThreeWords}</span>{" "}
            {/* Last three words semibold */}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function Benefits() {
  return (
    <section className="bg-[#0C0D0E] py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <BenefitBox title="Gain Real World Experience" />
          <BenefitBox title="Turn Ideas Into Reality" />
          <BenefitBox title="Travel Across The World" />
        </div>
      </Container>
    </section>
  );
}
