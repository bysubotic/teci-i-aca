import { ImageResponse } from "next/og";

export const alt = "Čeka se devojčica 🎀";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Warm share card (WhatsApp/Viber link preview). No external assets.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF7F2",
          backgroundImage:
            "radial-gradient(at 15% 12%, rgba(239,168,160,0.35) 0px, transparent 45%), radial-gradient(at 85% 8%, rgba(157,184,156,0.30) 0px, transparent 42%)",
          color: "#3D2B36",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 150 }}>🎀</div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 8 }}>Čeka se devojčica</div>
        <div
          style={{
            fontSize: 34,
            color: "#8a7680",
            marginTop: 24,
            maxWidth: 820,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Glasaj za ime, tipuj i ostavi želju za bebu Teodore i Aleksandra 💕
        </div>
      </div>
    ),
    { ...size },
  );
}
