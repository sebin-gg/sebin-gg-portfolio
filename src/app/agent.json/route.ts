import { buildAgentSnapshot } from "@/lib/agent";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildAgentSnapshot(), {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
