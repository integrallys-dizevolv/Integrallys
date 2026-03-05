import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Cake, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AniversariantesCard() {
    const aniversariantes = [
        { name: 'Maria Oliveira', date: 'Hoje', age: 28 },
        { name: 'Ricardo Santos', date: 'Amanhã', age: 45 },
        { name: 'Ana Beatriz', date: '10/11', age: 32 },
        { name: 'Carlos Ferreira', date: '12/11', age: 50 },
    ];

    return (
        <Card className="border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-card-dark overflow-hidden shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-app-border-dark/50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <Cake className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <CardTitle className="text-base font-normal dark:text-white">Aniversariantes</CardTitle>
                </div>
                <Badge variant="outline" className="font-normal text-[10px] uppercase tracking-wider text-app-text-muted">Novembro</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="space-y-1">
                    {aniversariantes.map((person, i) => (
                        <div key={i} className="group flex items-center justify-between p-2 rounded-lg hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-[#0039A6]/10 flex items-center justify-center text-[#0039A6] text-xs font-medium dark:bg-blue-900/40 dark:text-blue-300">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="text-sm font-normal dark:text-white">{person.name}</p>
                                    <p className="text-[11px] text-app-text-muted">{person.age} anos</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={`font-normal text-[10px] px-2 py-0 h-5 flex items-center justify-center border-none ${person.date === 'Hoje' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}
                                >
                                    {person.date}
                                </Badge>
                                <ChevronRight className="h-3.5 w-3.5 text-app-text-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 h-10 text-xs font-normal text-[#0039A6] hover:bg-[#0039A6]/5 dark:text-blue-400 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                    Ver lista completa
                </Button>
            </CardContent>
        </Card>
    );
}
