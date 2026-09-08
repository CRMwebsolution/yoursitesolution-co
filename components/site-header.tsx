"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
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

const links = [
  { href: "/websites", label: "Websites" },
  { href: "/automation", label: "Automation" },
  { href: "/tools", label: "Free Tools" },
  { href: "/pricing", label: "Pricing" },
  ...(publishedProjects.length ? [{ href: "/work", label: "Work" }] : []),
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-small header-cta" href="/contact">
          Tell me what you need
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <button className="menu-button" type="button" aria-label="Open menu">
              <Menu aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent className="mobile-menu" side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Your Site Solution navigation
              </SheetDescription>
            </SheetHeader>
            <div className="mobile-menu-links">
              {links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/free-demo">Free website demo</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link className="button" href="/contact">
                  Tell me what you need
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
