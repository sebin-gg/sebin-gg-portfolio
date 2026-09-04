type EyebrowProps = {
  children: string;
};

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <p className="border-accent/20 bg-accent-soft/60 text-accent mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
      <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  kicker: string;
  title: string;
  lede?: string;
  id: string;
};

export function SectionHeading({ kicker, title, lede, id }: SectionHeadingProps) {
  return (
    <div className="mb-10 sm:mb-12">
      <div>
        <Eyebrow>{kicker}</Eyebrow>
      </div>
      <h2
        id={id}
        className="text-ink mt-1 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      {lede ? (
        <p className="text-ink-soft mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">{lede}</p>
      ) : null}
    </div>
  );
}
