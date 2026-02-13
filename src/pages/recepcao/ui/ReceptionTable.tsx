import React from 'react'

interface Column<T> {
    header: string
    key: keyof T | string
    render?: (item: T) => React.ReactNode
    isAmount?: boolean
}

interface TableProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (item: T) => void
}

export const ReceptionTable = <T extends { id: string }>({ columns, data, onRowClick }: TableProps<T>) => {
    return (
        <div className="w-full overflow-x-auto rounded-[14px] border border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-card-dark">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-app-table-header dark:bg-app-table-header-dark">
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className={`p-4 text-xs font-bold text-app-text-muted uppercase tracking-widest ${col.isAmount ? 'text-right pr-8' : ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-app-border dark:divide-app-border-dark">
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            onClick={() => onRowClick?.(item)}
                            className="hover:bg-app-bg-secondary/50 dark:hover:bg-app-card-dark/30 transition-colors cursor-pointer group"
                        >
                            {columns.map((col, idx) => (
                                <td
                                    key={idx}
                                    className={`p-4 text-sm text-app-text-secondary dark:text-white/80 ${col.isAmount ? 'text-right pr-8 font-mono font-bold text-app-text-primary dark:text-white' : ''}`}
                                >
                                    {col.render ? col.render(item) : (item[col.key as keyof T] as any)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
