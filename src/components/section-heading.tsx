type SectionHeadingProps = {
  title: string;
  lede?: string;
  id: string;
};

export function SectionHeading({ title, lede, id }: SectionHeadingProps) {
  return (
    <div className="mb-10 sm:mb-12">
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
