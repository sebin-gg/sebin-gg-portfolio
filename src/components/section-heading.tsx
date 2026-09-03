type SectionHeadingProps = {
  kicker: string;
  title: string;
  lede?: string;
  id: string;
};

export function SectionHeading({ kicker, title, lede, id }: SectionHeadingProps) {
  return (
    <div className="mb-10 sm:mb-12">
      <p className="text-accent mb-2 font-mono text-sm"># {kicker}</p>
      <h2 id={id} className="text-ink text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {lede ? <p className="text-ink-soft mt-3 max-w-2xl">{lede}</p> : null}
    </div>
  );
}
