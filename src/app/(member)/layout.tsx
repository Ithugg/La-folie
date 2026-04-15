import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <Navbar user={{ name: session.user.name, role: session.user.role }} />
      <main className="flex-1 pt-20">{children}</main>
    </>
  );
}
