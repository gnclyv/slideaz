import { redirect } from "next/navigation";
import { auth } from "@/server/auth"; // sənin auth faylın

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Əgər login olmayıbsa və ya ADMIN deyilsə → ana səhifəyə at
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar burda olacaq */}
      <div className="w-64 border-r border-zinc-800 p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        {/* Menyu linkləri */}
      </div>

      {/* Əsas məzmun */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
