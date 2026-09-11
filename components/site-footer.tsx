"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="shell footer-cta">
        <p className="eyebrow eyebrow-light">{t("Have a project in mind?", "¿Tienes un proyecto?")}</p>
        <div>
          <h2>{t("Tell me what you need.", "Dime lo que necesitas.")}</h2>
          <Link className="circle-link" href="/contact" aria-label={t("Start a project", "Empezar un proyecto")}>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-note">
            {t(
              `Custom websites and useful systems, built in ${siteConfig.location}.`,
              `Sitios web y sistemas útiles, hechos en ${siteConfig.location}.`,
            )}
          </p>
        </div>
        <div className="footer-column">
          <p>{t("Services", "Servicios")}</p>
          <Link href="/websites">{t("Custom websites", "Sitios a medida")}</Link>
          <Link href="/automation">{t("Business automation", "Automatización")}</Link>
          <Link href="/upgrades">{t("Optional upgrades", "Mejoras opcionales")}</Link>
          <Link href="/tools">{t("Free tools", "Herramientas")}</Link>
          <Link href="/free-demo">{t("Free website demo", "Demo gratis")}</Link>
        </div>
        <div className="footer-column">
          <p>{t("Contact", "Contacto")}</p>
          <a href={`sms:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>{t("Text preferred", "Mejor por texto")}</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Your Site Solution</span>
        <span>{t("Website by Your Site Solution.", "Sitio de Your Site Solution.")}</span>
      </div>
    </footer>
  );
}
