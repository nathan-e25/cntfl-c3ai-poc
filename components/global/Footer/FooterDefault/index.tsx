import type { ButtonItem, FooterData, FooterLinkGroup } from "@/lib/sections/types";

type FooterDefaultProps = { footer: FooterData };

const TRACK = "tracking-[-0.3%]";
const COLOR_TRANSITION = "transition-[color] duration-100 ease-[cubic-bezier(0,0,0.2,1)]";

/**
 * Dark site footer: logo + two columns of headed link lists (">" bullets),
 * then a rule, social icons, legal links and the copyright line.
 * Columns: full width < lg, thirds from lg, ½ / ¼ / ¼ from 1440px.
 * List items keep the body font size with a 110% line height (it sets the
 * row height and the ">" bullet size); the links themselves are smaller.
 */
export function FooterDefault({ footer }: FooterDefaultProps) {
  const { logo, logoUrl, primaryGroups, secondaryGroups, socialLinks, legalLinks, copyright } =
    footer;

  return (
    <footer className="w-full bg-[var(--c3-hero-bg)] font-[family-name:var(--font-c3-display)] text-[length:clamp(1.125rem,1.0882rem+0.1635vw,1.25rem)] leading-[135%] text-[var(--c3-ink)] antialiased">
      <div className="mx-auto w-full max-w-[1600px] px-2.5 pt-[clamp(6.25rem,3.4756rem+12.3305vw,12.5rem)] pb-0 sm:px-[15px] lg:pt-[200px]">
        <div className="mb-10 flex flex-wrap items-start lg:mb-20">
          <div className="mb-[clamp(0rem,-1.1097rem+4.9322vw,2.5rem)] w-full pt-[2px] pb-10 lg:w-1/3 lg:pr-[37px] min-[1440px]:w-1/2!">
            {logo ? (
              <a href={logoUrl} className="inline-block" aria-label={`${logo.alt || "Home"} Home`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.url} alt={logo.alt} className="inline h-9 w-auto max-w-none align-baseline" />
              </a>
            ) : null}
          </div>
          <LinkColumn groups={primaryGroups} />
          <LinkColumn groups={secondaryGroups} />
        </div>

        <div className="border-t border-solid border-[var(--c3-white-12)] pt-[30px] pb-[50px] lg:pb-10">
          {socialLinks.length ? (
            <div className="mb-5 flex items-center gap-[18px]">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  aria-label={s.title}
                  className={`flex items-center hover:opacity-70 ${COLOR_TRANSITION}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.iconUrl} alt={s.title} className="h-4 w-auto" />
                </a>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-6">
            {legalLinks.length ? (
              <ul className="m-0 flex list-none flex-col items-start gap-3 p-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
                {legalLinks.map((l) => (
                  <li key={l.id} className="leading-[110%]">
                    <a
                      href={l.url}
                      target={l.openInNewTab ? "_blank" : undefined}
                      rel={l.openInNewTab ? "noopener noreferrer" : undefined}
                      className={`text-[12px] leading-[110%] font-bold capitalize text-[var(--c3-white)] no-underline ${TRACK} ${COLOR_TRANSITION} hover:text-[var(--c3-gray-151)]`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {copyright ? (
              <p className={`m-0 text-[12px] leading-[135%] font-bold text-[var(--c3-white)] text-pretty [text-box:cap_alphabetic] ${TRACK} lg:whitespace-nowrap`}>
                {copyright}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({ groups }: { groups: FooterLinkGroup[] }) {
  return (
    <div className="flex w-full flex-col pb-10 lg:w-1/3 lg:pr-[37px] min-[1440px]:w-1/4!">
      {groups.map((g) => (
        <div key={g.id} className="mb-[clamp(2.5rem,1.3903rem+4.9322vw,5rem)] last:mb-0">
          {g.heading ? (
            <p className={`m-0 mb-[clamp(0.625rem,0.0701rem+2.4661vw,1.875rem)] text-[length:clamp(0.875rem,0.8382rem+0.1635vw,1rem)] leading-[135%] font-bold text-[var(--c3-gray-151)] text-pretty [text-box:cap_alphabetic] ${TRACK}`}>
              {g.heading}
            </p>
          ) : null}
          <ul className="m-0 ml-5 flex list-none flex-col p-0">
            {g.links.map((l) => (
              <LinkItem key={l.id} link={l} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LinkItem({ link }: { link: ButtonItem }) {
  return (
    <li className="relative mb-1 leading-[110%] text-[var(--c3-white)] before:absolute before:-left-5 before:pr-[15px] before:font-light before:text-[var(--c3-white)] before:content-['>']">
      <a
        href={link.url}
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
        className={`text-[length:clamp(1rem,0.9632rem+0.1635vw,1.125rem)] leading-[110%] font-bold text-inherit not-italic no-underline ${TRACK} ${COLOR_TRANSITION} hover:text-[var(--c3-gray-151)]`}
      >
        {link.label}
      </a>
    </li>
  );
}
