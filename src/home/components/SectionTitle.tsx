type SectionTitleProps = {
  before?: string;
  highlight: string;
  after?: string;
  className?: string;
};

export default function SectionTitle({
  before = "",
  highlight,
  after = "",
  className = "",
}: SectionTitleProps) {
  return (
    <h2
      className={`text-center text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-heading-md md:text-[2.5rem] lg:text-[2.75rem] ${className}`}
    >
      {before}
      <span className="text-accent">{highlight}</span>
      {after}
    </h2>
  );
}
