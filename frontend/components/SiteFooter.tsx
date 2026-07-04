import Link from "next/link";
import { SECTIONS } from "@/lib/sections";

export default function SiteFooter() {
  return (
    <footer className="site-footer2">
      <div className="sf-cols">
        <div className="sf-col">
          <p className="sf-title">MSG · The Mecca, in app form</p>
          <p className="sf-text">
            A fan made shrine to the New York Knicks and the 2026
            championship. Built for hanging out, spinning facts, roasting
            rivals, and remembering that faith pays off. No logins, no feeds,
            no purpose except joy.
          </p>
          <p className="sf-text sf-fine">
            Fan project. Not affiliated with the NBA or the New York Knicks.
            Photos and audio are personal memorabilia and stay out of the
            public repo.
          </p>
        </div>
        <div className="sf-col">
          <p className="sf-title">The building</p>
          <ul className="sf-links">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href}>
                  {s.n} · {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sf-col">
          <p className="sf-title">The banners</p>
          <p className="sf-years">
            <span>1970</span>
            <span>1973</span>
            <span className="new">2026</span>
          </p>
          <p className="sf-text">
            53 years between the second and the third. Worth it.
          </p>
          <p className="made-by">DENZEL MADE THIS</p>
        </div>
      </div>
      <p className="sf-bottom">NEW YORK FOREVER · BING BONG · GO NY GO NY GO</p>
    </footer>
  );
}
