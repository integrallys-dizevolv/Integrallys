import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface FinanceiroStatCardProps {
    label: string;
    value: string;
    sub: string;
    color?: string;
    icon: LucideIcon;
    iconColor?: string;
}

export function FinanceiroStatCard({
    label,
    value,
    sub,
    color = 'text-app-text-primary dark:text-white',
    icon: Icon,
    iconColor
}: FinanceiroStatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-[#364153] dark:text-white/80">{label}</span>
                    <Icon size={18} className={iconColor} />
                </div>
                <div className={`text-2xl font-bold mb-1 ${color}`}>
                    {value}
                </div>
                <p className="text-xs text-app-text-secondary dark:text-app-text-muted mt-1">{sub}</p>
            </CardContent>
        </Card>
    );
}
