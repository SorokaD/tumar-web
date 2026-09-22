import { ButtonLink } from "@/components/ui/Button";
import { aboutCopy } from "@/lib/about";
import { siteConfig } from "@/lib/config";

export function ProfileLinks() {
  return (
    <div>
      <p className="text-lg tracking-tight text-foreground">{aboutCopy.name}</p>
      <p className="mt-1 text-sm text-muted">{aboutCopy.role}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {siteConfig.linkedinUrl ? (
          <ButtonLink href={siteConfig.linkedinUrl} external>
            LinkedIn
          </ButtonLink>
        ) : null}
        <ButtonLink
          href={siteConfig.githubUrl}
          variant={siteConfig.linkedinUrl ? "secondary" : "primary"}
          external
        >
          GitHub
        </ButtonLink>
      </div>
    </div>
  );
}
