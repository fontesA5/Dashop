export default function AnalyticsPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Revenue</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">$12,456</div>
          <div className="text-sm text-muted-foreground mt-1">All Time</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Conversion Rate</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9 18 15 12 9 6"/><path d="M3 15a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">3.8%</div>
          <div className="text-sm text-muted-foreground mt-1">Avg over last 30 days</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Visitors</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">24,567</div>
          <div className="text-sm text-muted-foreground mt-1">+8.2% from last month</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Orders</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">128</div>
          <div className="text-sm text-muted-foreground mt-1">+15.3% from last month</div>
        </div>
      </div>

      <p className="text-center text-muted-foreground">
        Analytics will populate with real data once you receive orders.
      </p>
    </div>
  )
}
