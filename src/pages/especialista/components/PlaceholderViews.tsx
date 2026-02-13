
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'

interface PlaceholderViewProps {
    title: string;
    onPageChange?: (page: string) => void;
}

const PlaceholderView = ({ title, onPageChange }: PlaceholderViewProps) => (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
        {onPageChange && (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )}
        <div className="flex flex-col items-center justify-center flex-1 text-app-text-muted">
            <h2 className="text-2xl font-normal mb-2">{title}</h2>
            <p>Esta funcionalidade estará disponível em breve.</p>
        </div>
    </div>
);

interface ViewProps {
    onPageChange?: (page: string) => void;
}

export const PacientesView = ({ onPageChange }: ViewProps) => <PlaceholderView title="Meus pacientes" onPageChange={onPageChange} />;
export const ProntuarioView = ({ onPageChange }: ViewProps) => <PlaceholderView title="Prontuário eletrônico" onPageChange={onPageChange} />;
export const AnamneseView = ({ onPageChange }: ViewProps) => <PlaceholderView title="Anamnese" onPageChange={onPageChange} />;
export const PrescricoesView = ({ onPageChange }: ViewProps) => <PlaceholderView title="Prescrições e receitas" onPageChange={onPageChange} />;

