export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Sales</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">$1,245.50</div>
          <div className="text-sm text-muted-foreground mt-1">Total Revenue</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Orders Today</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">45</div>
          <div className="text-sm text-muted-foreground mt-1">+8 from yesterday</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Products</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="6" y1="2" x2="6" y2="7"/><line x1="10" y1="2" x2="10" y2="7"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">128</div>
          <div className="text-sm text-muted-foreground mt-1">+3 added this week</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Low Stock Items</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22.5 12.5a2.121 2.121 0 0 1-2 2L16 18l-3-3-4 3a2.122 2.122 0 0 1-2-2V9.5a2.122 2.122 0 0 1 2-2h5"/>
              <line x1="7" y1="15" x2="17" y2="15"/><line x1="7" y1="18" x2="13" y2="18"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">8</div>
          <div className="text-sm text-muted-foreground mt-1">Need restocking soon</div>
        </div>
      </div>

      <p className="text-center text-muted-foreground">
        Dashboard analytics will be available after adding products and receiving orders.
      </p>
    </div>
  )
}
