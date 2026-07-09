import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Əgər login olmayıbsa → ana səhifəyə at
  if (!session?.user) {
    redirect("/");
  }

  // Əgər ADMIN deyilsə → ana səhifəyə at
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Gələcəkdə sidebar burda olacaq */}
      {children}
    </div>
  );
}
