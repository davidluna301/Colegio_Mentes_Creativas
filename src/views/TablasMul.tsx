// src\views\TablasMul.tsx
import MultiplicationTable from "../components/MultiplicationTable";
export default function TablasMul() {
  return (
    <div className="space-y-8">
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <MultiplicationTable />
        </div>
      </section>
    </div>
  );
}