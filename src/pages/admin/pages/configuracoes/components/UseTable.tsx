import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import { Card, CardContent } from '@/components/ui/Card'

interface Column<T> {
    header: string
    render: (item: T) => React.ReactNode
    className?: string
}

interface UseTableProps<T> {
    data: T[]
    columns: Column<T>[]
    emptyMessage?: string
    rowKey: (item: T) => string | number
}

export function UseTable<T>({
    data,
    columns,
    emptyMessage = 'Nenhum registro encontrado.',
    rowKey,
}: UseTableProps<T>) {
    return (
        <Card className="rounded-xl border-app-border dark:border-[#2d5a46] bg-app-card dark:bg-[#1a3028] shadow-sm overflow-hidden animate-in fade-in duration-500">
            <CardContent className="p-0">
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-app-card/5 border-b border-gray-100 dark:border-[#2d5a46] hover:bg-transparent">
                                {columns.map((column, index) => (
                                    <TableHead
                                        key={index}
                                        className={`h-12 px-6 text-[10px] font-black uppercase tracking-widest text-app-text-secondary dark:text-[#c3cec9] ${column.className || ''}`}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center py-12 text-[#1A1A1AB2] dark:text-[#c3cec9] font-medium"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item) => (
                                    <TableRow
                                        key={rowKey(item)}
                                        className="border-b border-gray-50 dark:border-[#2d5a46] hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors group"
                                    >
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={index}
                                                className={`px-6 py-4 text-sm ${column.className || ''}`}
                                            >
                                                {column.render(item)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
