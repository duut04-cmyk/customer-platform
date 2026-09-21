import Link from "next/link";
import Logo from "@/common/components/Logo";
import {
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialLinkedInIcon,
  SocialTwitterIcon,
} from "@/home/components/icons";

const footerLinks = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Deliveries", href: "#get-started" },
    { label: "Pricing", href: "#pricing" },
    { label: "For businesses", href: "#for-businesses" },
  ],
  Company: [
    { label: "About us", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help center", href: "#" },
    { label: "Contact us", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms of service", href: "#" },
    { label: "Cookie policy", href: "#" },
  ],
};

const socialLinks = [
  { label: "Facebook", href: "#", Icon: SocialFacebookIcon },
  { label: "Twitter", href: "#", Icon: SocialTwitterIcon },
  { label: "LinkedIn", href: "#", Icon: SocialLinkedInIcon },
  { label: "Instagram", href: "#", Icon: SocialInstagramIcon },
];

const linkClassName =
  "text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";

export default function Footer() {
  return (
    <footer className="overflow-x-hidden border-t border-border bg-background">
      <div className="site-content pt-10 pb-4 sm:pt-12 sm:pb-4 md:pt-12 md:pb-5 lg:pt-14 lg:pb-5">
        <div className="grid w-full items-start gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-8 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0 xl:grid-cols-5 xl:gap-x-10">
          <div className="space-y-4 sm:col-span-2 md:col-span-4 lg:col-span-2 xl:col-span-1 xl:space-y-5">
            <Link
              href="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <Logo className="text-2xl" />
            </Link>
            <p className="max-w-sm text-small leading-relaxed text-muted-foreground lg:max-w-none lg:text-caption lg:leading-snug xl:text-small xl:leading-relaxed">
              Best delivery options with transparent pricing — we find the right way to
              get your items delivered.
            </p>
            <div className="flex flex-nowrap gap-2 sm:gap-3 lg:gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30 sm:h-10 sm:w-10 lg:h-9 lg:w-9"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="min-w-0">
              <h3 className="mb-3 text-body font-semibold text-foreground sm:mb-3 lg:mb-2.5 lg:text-small xl:mb-3 xl:text-body">
                {group}
              </h3>
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={linkClassName}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border/60 pt-3 text-center sm:mt-6 sm:pt-3 lg:mt-8">
          <p className="text-caption text-muted-foreground">
            &copy; 2026 Doot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
