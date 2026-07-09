import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalUsers, totalPresentations, totalThemes, recentPresentations] = await Promise.all([
    prisma.user.count(),
    prisma.baseDocument.count({ where: { type: "PRESENTATION" } }),
    prisma.presentationTheme.count(),
    prisma.baseDocument.findMany({
      where: { type: "PRESENTATION" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-zinc-400 mb-8">Real məlumatlar Neon verilənlər bazasından gəlir</p>

      {/* Statistikalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Ümumi İstifadəçi</p>
          <p className="text-6xl font-bold mt-2">{totalUsers}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Prezentasiyalar</p>
          <p className="text-6xl font-bold mt-2">{totalPresentations}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-sm text-zinc-400">Custom Theme</p>
          <p className="text-6xl font-bold mt-2">{totalThemes}</p>
        </div>
      </div>

      {/* Son Prezentasiyalar */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Son yaradılmış prezentasiyalar</h2>
        
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-zinc-950">
              <tr>
                <th className="text-left p-4">Başlıq</th>
                <th className="text-left p-4">İstifadəçi</th>
                <th className="text-left p-4">Tarix</th>
              </tr>
            </thead>
            <tbody>
              {recentPresentations.map((doc) => (
                <tr key={doc.id} className="border-t border-zinc-800 hover:bg-zinc-950">
                  <td className="p-4 font-medium">{doc.title}</td>
                  <td className="p-4 text-sm text-zinc-400">{doc.user?.email || "—"}</td>
                  <td className="p-4 text-sm text-zinc-400">
                    {new Date(doc.createdAt).toLocaleDateString("az-AZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
