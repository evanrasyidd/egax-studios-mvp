export default function UserTable({ users }) {
  if (!users || users.length === 0) {
    return <p className="text-text2 text-sm py-6 text-center">No users yet.</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {['Name', 'Email', 'Role'].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-text2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-surface/50">
              <td className="py-3 px-4 text-[13px] text-text1 font-medium">{u.name}</td>
              <td className="py-3 px-4 text-[13px] text-text2">{u.email}</td>
              <td className="py-3 px-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${
                  u.role === 'admin' ? 'bg-accent/30 text-accent' : 'bg-surface text-text2'
                }`}>
                  {u.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
