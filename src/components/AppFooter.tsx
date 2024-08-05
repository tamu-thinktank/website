import Image from "next/image";
import Link from "next/link";

const socials = [
  {
    src: "/images/social_media/instagram.svg",
    link: "https://www.instagram.com/tamuthinktank/",
  },
  {
    src: "/images/social_media/linkedin.svg",
    link: "https://www.linkedin.com/company/tamu-thinktank/",
  },
  {
    src: "/images/social_media/tamu.svg",
    link: "https://stuactonline.tamu.edu/app/organization/index/index/id/2531",
  },
  {
    src: "/images/social_media/discord.svg",
    link: "https://discord.gg/qUAuSraYV9",
  },
];

export default function Footer() {
  return (
    <footer className="flex items-center justify-center py-20 md:py-10">
      <div className="grid h-full grid-cols-5 items-center justify-center gap-10 md:grid-cols-5">
        {socials.map((logo, index) => (
          <Link href={logo.link} target="_blank" key={index}>
            <Image
              key={index}
              src={logo.src}
              className={`mx-auto h-7 w-auto`}
              alt="client logo"
              width={0}
              height={0}
            />
          </Link>
        ))}
      </div>
    </footer>
  );
}
