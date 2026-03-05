import { useState } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { RepasseContent } from './components/RepasseContent';
import { RepasseConfigContent } from './components/RepasseConfigContent';

export const RepasseView = ({ onPageChange }: { onPageChange?: (page: string) => void }) => {
    const [activeTab, setActiveTab] = useState<'geracao' | 'configuracao'>('geracao');

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Breadcrumb - Corrected as per request */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => onPageChange?.('inicio')}
                            className="text-sm font-normal text-app-text-muted hover:text-gray-900 dark:text-app-text-muted dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Início
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className="text-sm font-normal text-app-text-muted">Financeiro</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm font-normal text-gray-900 dark:text-white">Repasse de Profissionais</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Tabs - Using SegmentedControl */}
            <div className="flex justify-center mb-10">
                <div className="w-full max-w-2xl">
                    <SegmentedControl
                        options={[
                            { value: 'geracao', label: 'Geração de repasse' },
                            { value: 'configuracao', label: 'Configuração' }
                        ]}
                        value={activeTab}
                        onChange={(val) => setActiveTab(val as 'geracao' | 'configuracao')}
                    />
                </div>
            </div>

            {activeTab === 'geracao' ? (
                <RepasseContent onPageChange={onPageChange} />
            ) : (
                <RepasseConfigContent />
            )}
        </div>
    );
};
