import TodoList from "../components/TodoList";
export default function ListaTareas() {
  return (
    <div className="space-y-8">
      {/* A) Container básico */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <TodoList />
        </div>
      </section>
    </div>
  );
}