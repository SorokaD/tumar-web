import { existsSync } from "node:fs";
import path from "node:path";
import { PROFILE_PHOTO_SRC, aboutCopy } from "@/lib/about";

export function AboutPhoto() {
  const filePath = path.join(process.cwd(), "public", PROFILE_PHOTO_SRC);

  if (!existsSync(filePath)) {
    return null;
  }

  return (
    <figure className="shrink-0 md:pt-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PROFILE_PHOTO_SRC}
        alt={aboutCopy.name}
        width={220}
        height={320}
        className="h-72 w-44 rounded-sm border border-border object-cover object-[center_18%] md:h-80 md:w-[220px]"
      />
    </figure>
  );
}
