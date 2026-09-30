export default function AdminPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-10">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">
        Admin Panel
      </h1>

      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10">
        Καλωσήρθες στο σύστημα διαχείρισης του CypRus News Network.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <a
          href="/admin/articles"
          className="p-4 rounded-lg bg-black text-white dark:bg-white dark:text-black text-center font-medium hover:opacity-80 transition"
        >
          Διαχείριση Άρθρων
        </a>

        <a
          href="/admin/settings"
          className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-center font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          Ρυθμίσεις Συστήματος
        </a>
      </div>
    </main>
  );
}
