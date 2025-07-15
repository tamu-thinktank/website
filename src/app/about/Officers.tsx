import Image from "next/image";
import Container from "../../components/Container";

export default function Officers() {
  const officers = [
    {
      id: 1,
      name: "Payas Joshi",
      role: "President",
      major: "Industrial Engineering",
      class: "27",
      image: "/images/avatars/payas.webp",
      bio: "Project Manager for Team Astraeus and President of ThinkTank with plans to expand ThinkTank's potential for the upcoming years. Loves to play basketball and video games.",
    },
    {
      id: 2,
      name: "Lukas Stockton",
      role: "Vice President",
      major: "Nuclear Engineering",
      class: "27",
      image: "/images/avatars/lukasstockton2526",
      bio: "Payload and Sensors Sub-Team lead for Team ORION and Vice President of ThinkTank. Loves the outdoors and playing guitar.",
    },
    {
      id: 3,
      name: "Moksh Shah",
      role: "Mini-DC PM & DCPM",
      major: "Aerospace Engineering",
      class: "27",
      image: "/images/avatars/moksh2526.webp",
      bio: "Thermal and Power Systems Engineer in Team Selenis - Won 1st place at the 2024 Engineering Project Showcase. Extensive research expertise in Lunar Space Operations. Loves to play tennis in his free time.",
    },
    {
      id: 4,
      name: "Vasudha Chilkoor",
      role: "Treasurer",
      major: "Mechanical Engineering",
      class: "28",
      image: "/images/avatars/vasudhac2526.webp",
      bio: "Part of Mechanical subteam in Team Servus- Finalist team for NASA's 2025 RASCAL Forum. Some of her hobbies include baking, crocheting, and going to the gym!",
    },
    {
      id: 5,
      name: "Lucas Vadlamudi",
      role: "Web Development",
      major: "Computer Science",
      class: "28",
      image: "/images/avatars/lucasvadlamudi2526",
      bio: "Led the redesign of the main ThinkTank website as part of Team Atlas. Loves to volunteer at pet shelters, donate to small businesses, and fight for gender equality.",
    },
    {
      id: 6,
      name: "Adhithi Venkatraghavan",
      role: "Web Development",
      major: "Electrical Engineering",
      class: "27",
      image: "/images/avatars/adhithiv2526",
      bio: "Working on edesigning the main ThinkTank website as a part of Team Atlas, mostly front-end and UI/UX. Loves to cook, play music, and make art, and enjoys writing sonnets about cheese and other assorted topics.  ",
    },
    {
      id: 7,
      name: "Anoushka Kaushik",
      role: "DCPM",
      major: "Aerospace Engineering",
      class: "28",
      image: "/images/avatars/anoushkakaushik2526",
      bio: "Member of Team Daedalus - Contributed to design of lunar washer/dryer. Loves to read and bake.",
    },
    {
      id: 8,
      name: "Rithvik Gogula",
      role: "DCPM",
      major: "Industrial Engineering",
      class: "27",
      image: "/images/avatars/rithvikgogula2526",
      bio: "Team lead for Team NOVA which participated in the NASA RASC-AL competition. Loves to play most sports and watch movies.",
    },
    {
      id: 9,
      name: "Diya Dev",
      role: "Marketing",
      major: "Data Engineering",
      class: "27",
      image: "/images/avatars/diyadev2526",
      bio: "Autonomy, Communication, and Navigation  sub-team in Servus- Finalist team for NASA's 2025 RASCAL Forum. Loves to read, play tennis, and doing new fun activities! ",
    },
    {
      id: 10,
      name: "Rohil Vinnakota",
      role: "Marketing",
      major: "Electrical Engineering",
      class: "27",
      image: "/images/avatars/rohilvinnakota2526",
      bio: "Maintenance and servicing sub team in Servus - Finalist in NASA's 2025 RASCAL forum. Loves to play tennis, basketball, and work out.",
    },
    {
      id: 11,
      name: "Joshua Wheeler",
      role: "Marketing",
      major: "Mechanical Engineering",
      class: "28",
      image: "/images/avatars/joshwheeler2526",
      bio: "Mechanical subteam member in Team Servus- Finalist team for NASA's 2025 RASCAL Forum. Loves reading, writing, and taking pictures of food and sending them to friends with no context.",
    },
    {
      id: 12,
      name: "Arjun Sawhney",
      role: "RCPM",
      major: "Aerospace Engineering",
      class: "27",
      image: "/images/avatars/arjunsawhney2526",
      bio: "Competed in Team Elementum in NASA BlueSkies competition and former NASA intern - Currently Program Manager for Recurring Teams. Loves to camp, bake, and play tennis.",
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
