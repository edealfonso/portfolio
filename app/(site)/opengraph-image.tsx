import { ImageResponse } from "next/og";

export const alt = "Elsa de Alfonso — Full Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 96px",
        background: "#f1f0ec",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          background: "#ff4d00",
          marginBottom: 48,
        }}
      />
      <div style={{ fontSize: 104, fontWeight: 300 }}>Elsa de Alfonso</div>
      <div style={{ fontSize: 38, color: "#8d8c88", marginTop: 24 }}>
        Full Stack Software Engineer
      </div>
    </div>,
    size,
  );
}
