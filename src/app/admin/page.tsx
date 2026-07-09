import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalUsers, totalPresentations, totalThemes, recentPresentations] = await Promise.all([
    prisma.user.count(),
    prisma.baseDocument.count({ where: { type: "PRESENTATION" } }),
    prisma.presentationTheme.count(),
    prisma.baseDocument.findMany({
      where: { type: "PRESENTATION" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistikalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Ümumi İstifadəçi</p>
          <p className="text-5xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Prezentasiyalar</p>
          <p className="text-5xl font-bold mt-2">{totalPresentations}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Custom Theme</p>
          <p className="text-5xl font-bold mt-2">{totalThemes}</p>
        </div>
      </div>

      {/* Son Prezentasiyalar */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Son yaradılmış prezentasiyalar</h2>
        
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-950">
                <th className="text-left p-4 font-medium">Başlıq</th>
                <th className="text-left p-4 font-medium">İstifadəçi</th>
                <th className="text-left p-4 font-medium">Tarix</th>
              </tr>
            </thead>
            <tbody>
              {recentPresentations.length > 0 ? (
                recentPresentations.map((doc) => (
                  <tr key={doc.id} className="border-t border-zinc-800 hover:bg-zinc-950">
                    <td className="p-4">{doc.title}</td>
                    <td className="p-4 text-sm text-zinc-400">{doc.user?.email || "—"}</td>
                    <td className="p-4 text-sm text-zinc-400">
                      {new Date(doc.createdAt).toLocaleDateString("az-AZ")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-zinc-400">
                    Hələ heç bir prezentasiya yaradılmayıb.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
