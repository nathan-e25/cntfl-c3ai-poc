"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { FooterLinkGroup, HeaderData, HeaderNavItem } from "@/lib/sections/types";
import "./header.css";

type HeaderDefaultProps = { header: HeaderData };

/** Scroll distance before scrolling down hides the bar. */
const HIDE_AFTER_PX = 60;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/** Adds `?src=<current page>` to contact links (c3.ai reports the home page as "/index"). */
const withSourcePage = (href: string, pathname: string) => {
  const url = new URL(href, "http://localhost");
  url.searchParams.set("src", pathname === "/" ? "/index" : pathname);
  return `${url.pathname}?${url.searchParams.toString()}`;
};

const trackContactClick = (label: string, pathname: string, destination: string) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "contact_us_click",
    cta_text: label,
    cta_location: pathname,
    destination,
  });
};

/**
 * Site header.
 * - Desktop (lg+): floating bar + "Contact Us" tab; mega dropdowns open on
 *   hover (CSS); Search opens on click/Enter and closes on outside mousedown
 *   or when the pointer moves onto the nav links.
 * - Mobile: fixed bar with a burger that slides in a drawer with an
 *   accordion (one section open at a time), Contact link and search form.
 * - Hides when scrolling down past 60px and returns when scrolling up, unless
 *   the drawer/search is open or the pointer is over the bar.
 */
export function HeaderDefault({ header }: HeaderDefaultProps) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const lastScroll = useRef(0);
  const searchRef = useRef<HTMLLIElement>(null);

  // Close the search panel on a mousedown anywhere outside it.
  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (menuOpen || searchOpen || hovering) {
        setHidden(false);
        lastScroll.current = y;
        return;
      }
      setHidden(y > lastScroll.current && y > HIDE_AFTER_PX);
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen, searchOpen, hovering]);

  const contactHref = withSourcePage(header.contactUrl, pathname);
  const logo = header.logo;

  return (
    <div className="c3-header">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header>
        <div
          className={`grid-container nav-outer${hidden ? " nav-outer--hidden" : ""}`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="nav-container grid-x">
            <div className="cell logo">
              {logo ? (
                <a href={header.logoUrl} aria-label={`${logo.alt.replace(/ Logo$/, "")} Home`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.url} alt={logo.alt} />
                </a>
              ) : null}
            </div>
            <div className="cell navbar">
              <ul
                className="nav-links"
                aria-label="Industry navigation"
                onMouseEnter={() => setSearchOpen(false)}
              >
                {header.navItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.dropdown ? undefined : item.url ?? undefined}>{item.label}</a>
                    {item.dropdown ? <MegaDropdown dropdown={item.dropdown} /> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="cell searchbar">
              <ul className="search-links">
                <li ref={searchRef} className={`-active${searchOpen ? " search-open" : ""}`}>
                  <a
                    role="button"
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSearchOpen((o) => !o)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSearchOpen((o) => !o);
                    }}
                    aria-expanded={searchOpen}
                    aria-haspopup="true"
                  >
                    <span id="click-search">{header.searchLabel}</span>
                  </a>
                  <div className="menu-dropdown" style={{ display: searchOpen ? "block" : "none" }}>
                    <div className="grid-container drop-content search-drop">
                      <div className="content-cols all">
                        <div className="search">
                          <SearchForm id="desktop-search" header={header} />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <a
            href={contactHref}
            className="nav-contact"
            onClick={() => trackContactClick(header.contactLabel, pathname, header.contactUrl)}
          >
            {header.contactLabel}
          </a>
        </div>

        <div className={`mobile-header${hidden ? " mobile-header--hidden" : ""}`}>
          {logo ? (
            <a href={header.logoUrl} className="logo" aria-label={`${logo.alt.replace(/ Logo$/, "")} Home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.url} alt={logo.alt} />
            </a>
          ) : null}
          <button
            type="button"
            className={`burger${menuOpen ? " burger--open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>

        <nav className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <button type="button" className="close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <span className="close-bar" />
            <span className="close-bar" />
          </button>
          <ul className="list">
            {header.navItems.map((item, i) => (
              <li key={item.id} className={`item${openItem === i ? " item--open" : ""}`}>
                <button
                  type="button"
                  className="trigger"
                  onClick={() => setOpenItem((cur) => (cur === i ? null : i))}
                  aria-expanded={openItem === i}
                >
                  <span>{item.label}</span>
                  <span className="chevron" aria-hidden="true" />
                </button>
                {item.dropdown ? (
                  <div className="accordion-drop">
                    <MobileDropdown item={item} />
                  </div>
                ) : null}
              </li>
            ))}
            <li className="item">
              <a
                href={contactHref}
                className="contact-link"
                onClick={() => trackContactClick(header.mobileContactLabel, pathname, header.contactUrl)}
              >
                {header.mobileContactLabel}
              </a>
            </li>
            <li className="item item--search">
              <div className="search">
                <SearchForm id="mobile-search" header={header} />
              </div>
            </li>
          </ul>
        </nav>
      </header>
      {menuOpen ? (
        <div className="mobile-nav__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      ) : null}
    </div>
  );
}

function SearchForm({ id, header }: { id: string; header: HeaderData }) {
  return (
    <form className="search-field" action={header.searchAction} method="get">
      <label htmlFor={id}>{header.searchFieldLabel}</label>
      <input type="text" id={id} name="q" autoComplete="off" />
      <button type="submit" aria-label="Submit search" />
    </form>
  );
}

function LinkSections({ sections }: { sections: FooterLinkGroup[] }) {
  return (
    <>
      {sections.map((s) => (
        <div key={s.id}>
          {s.heading ? <p className="type-cta space-6-clamp">{s.heading}</p> : null}
          <ul>
            {s.links.map((l) => (
              <li key={l.id}>
                <a href={l.url}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function MegaDropdown({ dropdown }: { dropdown: NonNullable<HeaderNavItem["dropdown"]> }) {
  const right = dropdown.right;
  return (
    <div className="menu-dropdown">
      <div className="grid-container drop-content">
        <div className="content-cols">
          <div className="drop-col left">
            <p className="type-h3">{dropdown.heading}</p>
          </div>
          <div className="drop-col center">
            <LinkSections sections={dropdown.centerSections} />
          </div>
          <div className="drop-col right">
            {right.type === "image" ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={right.src} alt={right.alt} loading="lazy" />
                <div className="caption">
                  <span>{right.captionLabel}</span>{" "}
                  {right.captionLink ? <a href={right.captionLink.url}>{right.captionLink.label}</a> : null}
                </div>
              </>
            ) : (
              <LinkSections sections={right.sections} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDropdown({ item }: { item: HeaderNavItem }) {
  const d = item.dropdown;
  if (!d) return null;
  const sections = [...d.centerSections, ...(d.right.type === "links" ? d.right.sections : [])];
  return (
    <div className="accordion-body">
      {sections.map((s) => (
        <div key={s.id} className="section">
          {s.heading ? <p className="section-heading">{s.heading}</p> : null}
          <ul className="sub-list">
            {s.links.map((l) => (
              <li key={l.id} className="sub-item">
                <a href={l.url}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
