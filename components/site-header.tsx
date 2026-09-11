"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { publishedProjects } from "@/config/site";

export function SiteHeader() {
  const { t, lang, setLang } = useLanguage();
  const links = [
    { href: "/websites", label: t("Websites", "Sitios") },
    { href: "/automation", label: t("Automation", "Automatización") },
    { href: "/upgrades", label: t("Upgrades", "Mejoras") },
    { href: "/tools", label: t("Free Tools", "Herramientas") },
    { href: "/pricing", label: t("Pricing", "Precios") },
    ...(publishedProjects.length ? [{ href: "/work", label: t("Work", "Trabajos") }] : []),
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label={t("Main navigation", "Navegación principal")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          aria-label={t("Switch language to Spanish", "Cambiar idioma a inglés")}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
        <Link className="button button-small header-cta" href="/contact">
          {t("Tell me what you need", "Dime lo que necesitas")}
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <button className="menu-button" type="button" aria-label={t("Open menu", "Abrir menú")}>
              <Menu aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent className="mobile-menu" side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">{t("Navigation", "Navegación")}</SheetTitle>
              <SheetDescription className="sr-only">
                Your Site Solution {t("navigation", "navegación")}
              </SheetDescription>
            </SheetHeader>
            <div className="mobile-menu-links">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/free-demo">{t("Free website demo", "Demo gratis")}</Link>
              </SheetClose>
              <SheetClose asChild>
                <button type="button" onClick={() => setLang(lang === "en" ? "es" : "en")}>
                  {lang === "en" ? "Español" : "English"}
                </button>
              </SheetClose>
              <SheetClose asChild>
                <Link className="button" href="/contact">
                  {t("Tell me what you need", "Dime lo que necesitas")}
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
