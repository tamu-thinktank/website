import Image from "next/image";
import Link from 'next/link';

const clientLogos = [
  {
    src: "/images/social_media/instagram.svg",
    link: 'https://www.instagram.com/tamuthinktank/',
  },
  {
    src: "/images/social_media/linkedin.svg",
    link: 'https://www.linkedin.com/company/tamu-thinktank/',
  },
  {
    src: "/images/social_media/linktree.svg",
    link: 'https://linktr.ee/tamuthinktank',
  },
  {
    src: "/images/social_media/tamu.svg",
    link: 'https://stuactonline.tamu.edu/app/organization/index/index/id/2531',
  },
  {
    src: "/images/social_media/discord.svg",
    link: 'https://discord.gg/qUAuSraYV9',
  }
];

export default function Footer() {
  return (
    <footer className="py-20 md:py-10 flex items-center justify-center">
            <div className="grid grid-cols-5 md:grid-cols-5 gap-10 items-center justify-center h-full">
              {
                clientLogos.map((logo, index) => (
                  <Link href={logo.link} target= "_blank" key={index}>
                    <Image
                      key={index}
                      src={logo.src}
                      className={`mx-auto h-5 w-auto`}
                      loading="lazy"
                      alt="client logo"
                      width={0}
                      height={0}
                    />
                  </Link>
                ))
              }
            </div>
    </footer>
  );
}
