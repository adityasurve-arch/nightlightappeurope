export default function TierBadge({ tier, size = 'sm' }) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`rounded-full font-semibold ${sizes[size]}`}
      style={{
        color: tier.color,
        backgroundColor: `${tier.color}22`,
        border: `1px solid ${tier.color}55`,
      }}
    >
      {tier.icon} {tier.name}
    </span>
  )
}
