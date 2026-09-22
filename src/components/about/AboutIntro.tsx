import { AboutPhoto } from "@/components/about/AboutPhoto";
import { aboutCopy } from "@/lib/about";

export function AboutIntro() {
  return (
    <div>
      <h1 className="text-3xl tracking-tight text-foreground md:text-5xl">
        {aboutCopy.title}
      </h1>

      <div className="mt-10 grid items-start gap-8 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 lg:gap-16">
        <div className="max-w-xl">
          <p className="text-lg leading-7 text-foreground md:text-xl">
            {aboutCopy.greeting}
          </p>
          {aboutCopy.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-5 text-base leading-7 text-muted md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <AboutPhoto />
      </div>

      <blockquote className="mt-12 max-w-xl border-l border-foreground/20 pl-5">
        <p className="text-xl leading-snug tracking-tight text-foreground md:text-2xl">
          {aboutCopy.highlight}
        </p>
      </blockquote>

      <div className="mt-8 max-w-xl space-y-5 text-base leading-7 text-muted md:text-lg">
        <p>{aboutCopy.origin}</p>
        <p>{aboutCopy.currentArea}</p>
      </div>
    </div>
  );
}
