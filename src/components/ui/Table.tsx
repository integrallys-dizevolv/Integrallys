import React from 'react'

export function Table({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto ">
      <table className={`w-full ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-app-table-header dark:bg-app-table-header-dark" {...props}>{children}</thead>
}

export function TableBody({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>
}

export function TableRow({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-b border-app-border dark:border-app-border-darkStrong ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`
        px-4
        py-3
        text-left
        text-xs
        font-medium
        text-app-text-secondary
        dark:text-white/60
        uppercase
        tracking-wider
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className = '', colSpan, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-3 text-sm text-app-text-primary dark:text-white ${className}`} colSpan={colSpan} {...props}>
      {children}
    </td>
  )
}
