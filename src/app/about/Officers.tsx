import Image from "next/image";
import Container from "../../components/Container";

export default function Officers() {
  const officers = [
    {
      id: 1,
      name: "Garrett Stevenson",
      role: "President",
      major: "major",
      class: "year",
      image: "/images/avatars/garrett.webp",
      bio: "About me",
    },
    {
      id: 2,
      name: "Payas Joshi",
      role: "Vice President",
      major: "major",
      class: "year",
      image: "/images/avatars/payas.webp",
      bio: "About me",
    },
    {
      id: 3,
      name: "Aiden Kampwerth",
      role: "Competition Team Administrator",
      major: "Aerospace Engineering",
      class: "26",
      image: "/images/avatars/aiden.webp",
      bio: "About me",
    },
    {
      id: 4,
      name: "Arjun Sawheny",
      role: "Competition Team Coordinator",
      major: "major",
      class: "year",
      image: "/images/avatars/arjun.webp",
      bio: "About me",
    },
    {
      id: 5,
      name: "Moksh Shah",
      role: "Competition Team Coordinator",
      major: "major",
      class: "year",
      image: "/images/avatars/moksh.webp",
      bio: "About me",
    },
    {
      id: 6,
      name: "Jae-son Rivera",
      role: "Public Outreach Officer",
      major: "major",
      class: "year",
      image: "/images/avatars/jaeson.webp",
      bio: "About me",
    },
    {
      id: 7,
      name: "Landon Uelsmann",
      role: "Treasurer",
      major: "major",
      class: "year",
      image: "/images/avatars/landon.webp",
      bio: "About me",
    },
    {
      id: 8,
      name: "Krishnan Vellore",
      role: "Advisory Officer",
      major: "major",
      class: "year",
      image: "/images/avatars/krishnan.webp",
      bio: "About me",
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
                <h3 className="text-xl font-bold text-white">{officer.name}</h3>
                <p className="text-md mt-1 font-semibold text-gray-200">
                  {officer.major} '{officer.class}
                </p>
                <p className="mt-3 text-sm text-gray-200">{officer.role}</p>
                <p className="mt-3 px-4 text-center text-sm text-gray-200">
                  {officer.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "30px" }}></div>
      </Container>
    </div>
  );
}
