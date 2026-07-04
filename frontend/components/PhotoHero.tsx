/** Rounded photo banner with a caption. Keeps pages neat, adds the real thing. */
export default function PhotoHero({
  src,
  caption,
  maxWidth = 840,
  height = 240,
  position = "center",
}: {
  src: string;
  caption: string;
  maxWidth?: number;
  height?: number;
  position?: string;
}) {
  return (
    <div className="photo-hero" style={{ maxWidth, height }}>
      <img src={src} alt={caption} style={{ objectPosition: position }} />
      <span className="ph-caption">{caption}</span>
    </div>
  );
}
