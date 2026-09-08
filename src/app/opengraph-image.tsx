import { ImageResponse } from "next/og";
import { profile, siteMeta } from "@/lib/site";

export const alt = `${profile.name} — portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 80px",
        background: "#090d16",
        borderTop: "12px solid #818cf8",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#818cf8", fontWeight: 600 }}>
        {profile.role}
      </div>
      <div style={{ display: "flex", fontSize: 88, color: "#f8fafc", fontWeight: 800 }}>
        {profile.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#94a3b8",
          marginTop: 8,
          maxWidth: 980,
        }}
      >
        {siteMeta.description}
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#7d8aa6", marginTop: 28 }}>
        {profile.collegeShort} · {profile.location}
      </div>
    </div>,
    { ...size },
  );
}
