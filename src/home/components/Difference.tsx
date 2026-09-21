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
      className={`relative flex flex-col overflow-hidden rounded-3xl p-4 sm:p-5 lg:min-h-[300px] lg:p-6 lg:pb-0 lg:pr-0 xl:min-h-0 xl:p-8 ${
        isDutt ? "bg-surface-accent" : "bg-surface"
      }`}
    >
      <div className="relative z-10 shrink-0 lg:max-w-[54%] lg:pr-4 lg:pb-6 xl:max-w-[42%] xl:pr-8 xl:pb-8">
        <h3 className="text-base font-bold text-foreground sm:text-lg lg:whitespace-nowrap lg:text-lg xl:text-2xl">
          {title}
          {titleHighlight && <span className="text-accent">{titleHighlight}</span>}
          {isDutt ? " way" : ""}
        </h3>

        <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2 lg:mt-4 lg:space-y-2.5 xl:mt-5 xl:space-y-3.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 sm:gap-2.5 lg:items-center lg:gap-2.5 xl:gap-3.5"
            >
              {isDutt ? (
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6 lg:mt-0 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
              ) : (
                <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6 lg:mt-0 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
              )}
              <span className="text-[0.8125rem] font-semibold leading-snug text-muted-foreground sm:text-small lg:text-small xl:text-body">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none relative hidden w-full shrink-0 lg:absolute lg:bottom-0 lg:right-0 lg:top-14 lg:block lg:h-auto lg:w-[46%] lg:max-w-none xl:top-12 xl:w-[68%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 1279px) 22vw, 34vw"
          className="object-contain object-bottom object-right"
        />
      </div>
    </div>
  );
}

export default function Difference() {
  return (
    <section id="about" className="scroll-mt-20 py-5 sm:py-6 md:py-8 lg:py-12 xl:py-14">
      <div className="site-content">
        <SectionTitle before="The " highlight="Doot" after=" difference" />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 md:mt-6 md:grid-cols-2 md:items-stretch md:gap-4 lg:mt-8 lg:gap-6">
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
