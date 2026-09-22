import { aboutCopy } from "@/lib/about";

export function ResearchQuestion() {
  return (
    <div className="max-w-xl">
      <p className="text-base leading-7 text-muted md:text-lg">
        {aboutCopy.questionLead}
      </p>
      <p className="mt-5 text-xl leading-snug tracking-tight text-foreground md:text-2xl">
        {aboutCopy.question}
      </p>
      <p className="mt-10 text-base leading-7 text-muted md:text-lg">
        {aboutCopy.pathLead}
      </p>
      <p className="mt-4 font-mono text-sm tracking-wide text-foreground md:text-base">
        {aboutCopy.path.join(" → ")}
      </p>
      <p className="mt-6 text-base leading-7 text-muted md:text-lg">
        {aboutCopy.friction}
      </p>
      <p className="mt-5 text-base leading-7 text-muted md:text-lg">
        {aboutCopy.environment}
      </p>
      <p className="mt-5 text-base leading-7 text-muted md:text-lg">
        {aboutCopy.future}
      </p>
    </div>
  );
}
