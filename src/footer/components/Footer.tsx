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
    { label: "Deliveries", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#" },
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
    <footer className="border-t border-border bg-background">
      <div className="site-content py-12 md:py-14">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="space-y-5 md:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
            >
              <Logo className="text-2xl" />
            </Link>
            <p className="max-w-xs text-small leading-relaxed text-muted-foreground">
              Smart delivery orchestration
              <br />
              that finds the best way
              <br />
              to get your items delivered.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-4 text-body font-semibold text-foreground">
                {group}
              </h3>
              <ul className="space-y-3">
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

        <div className="mt-12 border-t border-border/60 pt-8 text-center">
          <p className="text-caption text-muted-foreground">
            &copy; 2026 Dutt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
