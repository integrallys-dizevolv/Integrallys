import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"

interface Column {
    header: string
    key: string
    className?: string
    align?: 'left' | 'center' | 'right'
}

interface StandardTableProps<T> {
    columns: Column[]
    data: T[]
    renderCell: (item: T, columnKey: string) => React.ReactNode
}

export function StandardTable<T>({ columns, data, renderCell }: StandardTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                        {columns.map((column, idx) => (
                            <TableHead
                                key={column.key}
                                className={`font-medium text-app-text-muted py-4 ${idx === 0 ? 'px-6' : 'px-4'} ${column.align === 'center' ? 'text-center' : ''} ${column.className || ''}`}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, rowIdx) => (
                        <TableRow
                            key={rowIdx}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark/50 transition-colors"
                        >
                            {columns.map((column, colIdx) => (
                                <TableCell
                                    key={column.key}
                                    className={`py-4 ${colIdx === 0 ? 'px-6' : 'px-4'} ${column.align === 'center' ? 'text-center' : ''}`}
                                >
                                    {renderCell(item, column.key)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
