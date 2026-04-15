"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/story", label: "Story" },
    { href: "/events", label: "Events" },
    { href: "/access", label: "Access" },
  ];

  const memberLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/events", label: "Events" },
    { href: "/referrals", label: "Referrals" },
    { href: "/tickets", label: "Tickets" },
    { href: "/profile", label: "Profile" },
  ];

  const links = user ? memberLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-obsidian/80 backdrop-blur-xl border-b border-ash/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gradient-gold">
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
                  "relative px-4 py-2 text-sm transition-colors rounded-lg",
                  pathname === link.href
                    ? "text-gold"
                    : "text-mist hover:text-ivory"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="w-8 h-8 rounded-full bg-ash flex items-center justify-center text-xs font-medium text-ivory hover:bg-smoke transition-colors"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-obsidian bg-ivory px-5 py-2 rounded-lg hover:bg-cream transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-mist hover:text-ivory"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-ash/50 mt-2 pt-4"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2.5 text-sm rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-gold bg-gold/5"
                    : "text-mist hover:text-ivory hover:bg-ash/30"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block mx-4 mt-3 text-center text-sm text-obsidian bg-ivory px-5 py-2.5 rounded-lg font-medium"
              >
                Sign In
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block mx-4 mt-3 text-center text-xs text-gold border border-gold/30 px-3 py-2 rounded-lg"
              >
                Admin Panel
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
