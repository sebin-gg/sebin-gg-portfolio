type EyebrowProps = {
  children: string;
};

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <p className="text-accent mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
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
      <Eyebrow>{kicker}</Eyebrow>
      <h2 id={id} className="text-ink text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {lede ? <p className="text-ink-soft mt-3 max-w-2xl">{lede}</p> : null}
    </div>
  );
}
