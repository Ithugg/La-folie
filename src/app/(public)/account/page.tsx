import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountForm } from "./account-form";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; redirect?: string; tab?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    const dest =
      params.redirect && params.redirect.startsWith("/") && !params.redirect.startsWith("//")
        ? params.redirect
        : "/dashboard";
    redirect(dest);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-24">
      {/* Top minimal nav */}
      <nav className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="font-cursive text-2xl text-gradient-gold">
          La Folie
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/calendar"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="/about"
            className="text-[11px] tracking-[0.3em] uppercase text-ivory/60 hover:text-ivory transition-colors"
          >
            About Us
          </Link>
        </div>
      </nav>

      <div className="absolute inset-0 bg-radial-dark pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <AccountForm
        initialCode={params.code ?? ""}
        initialTab={params.tab === "register" || params.code ? "register" : "signin"}
        redirectTo={params.redirect ?? "/dashboard"}
      />
    </div>
  );
}
