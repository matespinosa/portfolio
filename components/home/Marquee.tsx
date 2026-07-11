import { profile } from "@/content/profile";

export function Marquee() {
  const items = [...profile.marquee, ...profile.marquee];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`}>
            {item}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
