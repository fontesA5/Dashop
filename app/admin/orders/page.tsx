export default function OrdersPage() {
  const orders = [
    { 
      id: '#DASHOP-2847', 
      customer: 'John Doe', 
      email: 'john@example.com', 
      total: 63.15,
      status: 'Completed',
      items: 5,
      date: new Date().toISOString(),
      is_guest: false,
    },
    { 
      id: '#DASHOP-2846', 
      customer: 'Sarah Smith', 
      email: 'sarah@example.com', 
      total: 124.99,
      status: 'Processing',
      items: 8,
      date: new Date(Date.now() - 3600000).toISOString(),
      is_guest: false,
    },
    { 
      id: '#DASHOP-2845', 
      customer: 'Guest Checkout', 
      email: null, 
      total: 45.50,
      status: 'Pending',
      items: 3,
      date: new Date(Date.now() - 7200000).toISOString(),
      is_guest: true,
    },
    { 
      id: '#DASHOP-2844', 
      customer: 'Mike Johnson', 
      email: 'mike@example.com', 
      total: 89.99,
      status: 'Completed',
      items: 4,
      date: new Date(Date.now() - 18000000).toISOString(),
      is_guest: false,
    },
  ]

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Order ID</th>
              <th className="text-left py-3 px-4 font-medium">Customer</th>
              <th className="text-right py-3 px-4 font-medium">Total</th>
              <th className="text-center py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="py-3 px-4 font-mono text-primary">{order.id}</td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium">{order.customer}</span>
                    {order.email && (
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium">${order.total.toFixed(2)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-muted-foreground">
                  {new Date(order.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No orders found.
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusBadge(status: string) {
  const badges: Record<string, string> = {
    'Completed': 'bg-green-500/10 text-green-700',
    'Processing': 'bg-blue-500/10 text-blue-700',
    'Pending': 'bg-yellow-500/10 text-yellow-700',
    'Cancelled': 'bg-red-500/10 text-red-700',
  }
  return badges[status] || 'bg-gray-500/10 text-gray-700'
}
