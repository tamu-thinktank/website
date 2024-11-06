import Image from "next/image";
import Container from "../../components/Container";

export default function Officers() {
  const officers = [
    {
      id: 1,
      name: "Garrett Stevenson",
      role: "President",
      major: "Aerospace Engineering",
      class: "25",
      image: "/images/avatars/garrett.webp",
      bio: "Competed in several design challenges. Experienced in systems engineering, mission concept development, and radio frequency communications. Loves spacecraft, hiking, and mashed potatoes.",
    },
    {
      id: 2,
      name: "Payas Joshi",
      role: "Vice President",
      major: "Industrial Engineering",
      class: "27",
      image: "/images/avatars/payas.webp",
      bio: "Previously, I was the Team Lead for Team Astraeus for which me and my team designed a full-scale mission to explore Venus’ surface. My interests are primarily in operations research and systems engineering. In my free time, I love to watch UFC, cook while listening to music, and play football.",
    },
    {
      id: 3,
      name: "Aiden Kampwerth",
      role: "Competition Team Administrator",
      major: "Aerospace Engineering",
      class: "26",
      image: "/images/avatars/aiden.webp",
      bio: "Team Lead for Team Vestigo - Won 1st place in competition. Specialty in scientific computing for aerospace applications. Enjoys movies, tennis, and cooking.",
    },
    {
      id: 4,
      name: "Arjun Sawheny",
      role: "Peer Mentor",
      major: "Aerospace Engineering",
      class: "27",
      image: "/images/avatars/arjun.webp",
      bio: "Part of Team Elementum - Competed in the 2023 BlueSkies Challenge. Interested in human spaceflight and exploration. Loves the outdoors, camping, and good food.",
    },
    {
      id: 5,
      name: "Moksh Shah",
      role: "Peer Mentor",
      major: "Aerospace Engineering",
      class: "27",
      image: "/images/avatars/moksh.webp",
      bio: "Part of Team Selenis - Won 1st place at Engineering Project Showcase. Extensive research expertise in Lunar Operations. Loves to play tennis in free time.",
    },
    {
      id: 6,
      name: "Jae-son Rivera",
      role: "Public Relations",
      major: "Aerospace Engineering",
      class: "25",
      image: "/images/avatars/jaeson.webp",
      bio: "Competed in several design challenges. Propulsion systems and digital modeling focused, with an interest in radio communication. Enjoys drawing and tinkering with analogue technology.",
    },
    {
      id: 7,
      name: "Landon Uelsmann",
      role: "Treasurer",
      major: "Computer Science",
      class: "26",
      image: "/images/avatars/landon.webp",
      bio: "Part of Team Vestigo - Won 1st place in competition. Interest in cryptography and machine learning. I love to play Fortnite competitively in my free time.",
    },
    {
      id: 8,
      name: "Ipshita Singh",
      role: "Marketing Specialist",
      major: "Mechanical Engineering",
      class: "27",
      image: "/images/avatars/ipshita.webp",
      bio: "Part of Team Astraeus. Worked mainly on the GNC subsystem. Enjoys trying new places to eat and watching good movies.",
    },
    {
      id: 9,
      name: "Krishnan Vellore",
      role: "Web Dev",
      major: "Aerospace Engineering",
      class: "25",
      image: "/images/avatars/krishnan.webp",
      bio: "Competed in several design challenges. Working a Real-Time Multi-Regime Aerodynamics model and IV&V for Crew Dragon FSW. Enjoys swimming, bouldering, and playing KSP.",
    },
  ];

  return (
    <div className="text-gray-600 dark:text-gray-300" id="officers">
      <Container>
        <div className="mb-8 space-y-4 px-6 md:px-0">
          <h2 className="text-left text-3xl font-semibold italic text-gray-800 dark:text-white md:text-4xl">
            Officers
          </h2>
          <hr className="border-t-2 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Grid layout */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {officers.map((officer) => (
            <div
              key={officer.id}
              className="group relative aspect-square transform overflow-hidden rounded-3xl shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 dark:bg-gray-800"
            >
              {/* Officer Image */}
              <Image
                className="h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-50"
                src={officer.image}
                alt={`${officer.name} avatar`}
                width={500}
                height={500}
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-60 group-hover:opacity-100">
                <h3 className="text-2xl font-bold text-white">
                  {officer.name}
                </h3>
                <p className="mt-1 text-xl font-semibold text-gray-200">
                  {officer.major} '{officer.class}
                </p>
                <p className="mt-1 text-lg text-gray-200">{officer.role}</p>
                <p className="mt-3 px-4 text-center text-sm text-gray-200">
                  {officer.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
