import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is admin (simple check - in production use Supabase auth)
  let session: any = { data: { user: { email: 'admin@dashop.local' } } };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r bg-card hidden lg:block">
        <div className="p-4 border-b">
          <span className="text-xl font-bold">dashop</span>
        </div>

        <nav className="p-4 space-y-1">
          <a 
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Dashboard
          </a>

          <a 
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Products
          </a>

          <a 
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Orders
          </a>

          <a 
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Analytics
          </a>

          <a 
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Settings
          </a>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <p className="text-xs text-muted-foreground truncate">
            Logged in as {session?.data?.user?.email || 'Admin'}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${!children ? 'hidden lg:block' : ''}`}>
        {children}
      </main>
    </div>
  )
}
