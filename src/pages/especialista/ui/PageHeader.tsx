import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Home, ChevronRight, Plus, ChevronLeft } from 'lucide-react'

interface BreadcrumbItemType {
    label: string
    onClick?: () => void
    isCurrent?: boolean
}

interface PageHeaderProps {
    title: string
    subtitle?: string
    breadcrumbs?: BreadcrumbItemType[]
    primaryAction?: {
        label: string
        icon?: React.ElementType
        onClick: () => void
    }
    onPageChange: (page: string) => void
    extra?: React.ReactNode
    backAction?: {
        label: string
        onClick: () => void
    }
}

export function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    primaryAction,
    onPageChange,
    extra,
    backAction
}: PageHeaderProps) {
    return (
        <div className="relative -mt-8 -mx-8 mb-8 pb-4">
            {/* Sticky Breadcrumb Bar */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="px-8 py-4 mb-4">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-app-text-muted dark:text-app-text-muted">
                        <button
                            onClick={() => onPageChange('inicio')}
                            className="hover:text-[#0039A6] dark:hover:text-white transition-colors font-medium no-underline"
                        >
                            Início
                        </button>
                        {breadcrumbs?.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <ChevronRight className="h-4 w-4 text-app-text-muted" />
                                {crumb.isCurrent ? (
                                    <span className="font-medium text-gray-900 dark:text-white no-underline">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <button
                                        onClick={crumb.onClick}
                                        className="hover:text-[#0039A6] dark:hover:text-white transition-colors font-medium"
                                    >
                                        {crumb.label}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Title and Actions Bar */}
            <div className="px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 w-full md:w-auto">
                    <h1 className="text-2xl font-normal text-gray-900 dark:text-white tracking-tight">{title}</h1>
                    {subtitle && <p className="text-app-text-muted dark:text-app-text-muted font-normal">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {backAction && (
                        <Button
                            variant="outline"
                            onClick={backAction.onClick}
                            className="h-11 px-4 rounded-[10px] border-app-border dark:border-gray-800 flex items-center gap-2 text-gray-600 dark:text-app-text-muted font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {backAction.label}
                        </Button>
                    )}
                    {extra}
                    {primaryAction && (
                        <Button
                            onClick={primaryAction.onClick}
                            className="bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] h-11 px-6 shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] w-full md:w-auto flex items-center justify-center gap-2"
                        >
                            {primaryAction.icon ? <primaryAction.icon className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                            <span className="font-normal">{primaryAction.label}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
