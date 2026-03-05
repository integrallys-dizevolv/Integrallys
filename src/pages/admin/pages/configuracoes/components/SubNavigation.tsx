interface SubNavigationItem {
  value: string
  label: string
}

interface SubNavigationProps {
  items: SubNavigationItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function SubNavigation({ items, value, onValueChange, className = '' }: SubNavigationProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-app-card/5 p-1 ${className}`}>
      {items.map((item) => {
        const isActive = value === item.value
        return (
          <button
            key={item.value}
            onClick={() => onValueChange(item.value)}
            className={`
              inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium
              transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50
              ${isActive
                ? 'bg-app-card dark:bg-app-bg-dark text-app-text-primary dark:text-white shadow-sm border border-app-border/50 dark:border-app-border-dark'
                : 'text-[#1A1A1AB2] dark:text-white/60 hover:bg-app-card/50 dark:hover:bg-app-card/10'
              }
            `}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
