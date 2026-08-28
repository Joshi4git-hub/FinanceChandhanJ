import { createClient } from './utils/supabase/server'

export default async function Page() {
  let cookieStore: any
  try {
    const nextHeaders = await import('next/headers')
    cookieStore = await nextHeaders.cookies()
  } catch {
    cookieStore = undefined
  }

  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Todos List</h1>
      <ul className="space-y-2">
        {todos && todos.length > 0 ? (
          todos.map((todo: any) => (
            <li
              key={todo.id}
              className="p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-sm"
            >
              {todo.name || todo.title || JSON.stringify(todo)}
            </li>
          ))
        ) : (
          <li className="text-slate-400 italic">No todos found or table is empty.</li>
        )}
      </ul>
    </div>
  )
}
