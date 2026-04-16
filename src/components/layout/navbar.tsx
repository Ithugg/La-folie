"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/calendar", label: "Calendar" },
    { href: "/about", label: "About" },
  ];

  const memberLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/calendar", label: "Calendar" },
    { href: "/referrals", label: "Referrals" },
    { href: "/tickets", label: "Tickets" },
    { href: "/profile", label: "Profile" },
  ];

  const links = user ? memberLinks : publicLinks;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-heavy shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <span className="font-cursive text-3xl text-gradient-gold group-hover:opacity-80 transition-opacity duration-300">
              La Folie
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-5 py-2 text-[11px] tracking-[0.15em] uppercase transition-colors duration-300",
                  pathname === link.href
                    ? "text-gold"
                    : "text-ivory/50 hover:text-ivory"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-[10px] tracking-[0.15em] uppercase text-gold/70 border border-gold/20 px-4 py-1.5 rounded-full hover:bg-gold/10 hover:border-gold/40 transition-all duration-300"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xs font-medium text-gold hover:bg-gold/20 hover:border-gold/30 transition-all duration-300"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <Link
                href="/account"
                className="group relative inline-flex items-center justify-center px-7 py-2.5 overflow-hidden rounded-full"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute inset-[1px] bg-obsidian/60 rounded-full group-hover:bg-obsidian/20 transition-all duration-500" />
                <span className="relative text-[10px] font-medium tracking-[0.2em] uppercase text-ivory group-hover:text-white transition-colors duration-300">
                  Enter
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-ivory transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="relative w-5 h-4">
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-current transition-all duration-300 origin-center",
                  mobileOpen ? "top-1/2 rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-px w-full bg-current transition-all duration-300",
                  mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-px w-full bg-current transition-all duration-300 origin-center",
                  mobileOpen ? "top-1/2 -rotate-45" : "top-full"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 border-t border-gold/10 mt-2 pt-6"
          >
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-[11px] tracking-[0.15em] uppercase rounded-lg transition-all duration-300",
                    pathname === link.href
                      ? "text-gold bg-gold/5 border-l-2 border-gold"
                      : "text-ivory/50 hover:text-ivory hover:bg-white/[0.03]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 px-4">
              {!user ? (
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center text-[11px] tracking-[0.15em] uppercase text-gold border border-gold/30 px-5 py-3 rounded-full hover:bg-gold/10 transition-all"
                >
                  Enter
                </Link>
              ) : (
                <>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center text-[11px] tracking-[0.15em] uppercase text-gold/70 border border-gold/20 px-3 py-2.5 rounded-full mb-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
