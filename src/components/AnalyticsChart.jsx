import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toMonthly } from '../utils/dateHelpers.js'

const CATEGORY_COLORS = {
  Entertainment: '#8b5cf6',
  'Dev Tools': '#3b82f6',
  Utilities: '#10b981',
  Others: '#f59e0b',
}

const RADIAN = Math.PI / 180

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AnalyticsChart({ subscriptions, currencySymbol = '$' }) {
  // Aggregate monthly spend by category
  const categoryTotals = subscriptions.reduce((acc, sub) => {
    const monthly = toMonthly(sub.cost, sub.billingCycle)
    acc[sub.category] = (acc[sub.category] || 0) + monthly
    return acc
  }, {})

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No subscription data yet
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${currencySymbol}${value.toFixed(2)}/mo`, 'Spend']}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
