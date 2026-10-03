import { profile } from "@/lib/site";
import { renderOpenGraphImage } from "@/app/(root)/opengraph-image";

export const alt = `${profile.name} — portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function GET() {
  return renderOpenGraphImage();
}
