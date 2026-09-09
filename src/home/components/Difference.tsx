import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { CheckCircleIcon, XCircleIcon } from "./icons";

const traditionalItems = [
  "Search multiple providers",
  "Compare prices",
  "Check availability",
  "Choose a vehicle",
  "Book the delivery",
  "Track across different apps",
];

const dootItems = [
  "Tell us what you need",
  "We compare in real time",
  "We recommend the best option",
  "You review price and book",
  "Track everything in one place",
];

function ComparisonCard({
  title,
  titleHighlight,
  items,
  variant,
  imageSrc,
  imageAlt,
}: {
  title: string;
  titleHighlight?: string;
  items: string[];
  variant: "traditional" | "dutt";
  imageSrc: string;
  imageAlt: string;
}) {
  const isDutt = variant === "dutt";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 md:pb-0 md:pr-0 ${
        isDutt ? "bg-surface-accent" : "bg-surface"
      }`}
    >
      <div className="relative z-10 pb-6 md:max-w-[42%] md:pr-8 md:pb-8">
        <h3 className="text-xl font-bold text-foreground md:text-2xl">
          {title}
          {titleHighlight && <span className="text-accent">{titleHighlight}</span>}
          {isDutt ? " way" : ""}
        </h3>

        <ul className="mt-5 space-y-3.5">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3.5">
              {isDutt ? (
                <CheckCircleIcon className="h-7 w-7 shrink-0 text-accent" />
              ) : (
                <XCircleIcon className="h-7 w-7 shrink-0" />
              )}
              <span className="text-body font-semibold leading-snug text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-6 h-[220px] w-full max-w-[320px] md:absolute md:bottom-0 md:right-0 md:top-12 md:mt-0 md:h-auto md:w-[68%] md:max-w-none">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 320px, 68vw"
          className="object-contain object-bottom object-right"
        />
      </div>
    </div>
  );
}

export default function Difference() {
  return (
    <section className="bg-background py-10 md:py-14">
      <div className="site-content">
        <SectionTitle before="The " highlight="Doot" after=" difference" />

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <ComparisonCard
            title="The traditional way"
            items={traditionalItems}
            variant="traditional"
            imageSrc="/pages/traditional_way.png"
            imageAlt="Person confused by multiple delivery provider options"
          />
          <ComparisonCard
            title="The "
            titleHighlight="Doot"
            items={dootItems}
            variant="dutt"
            imageSrc="/pages/dutt_way.png"
            imageAlt="Person confidently using Doot on their phone"
          />
        </div>
      </div>
    </section>
  );
}
