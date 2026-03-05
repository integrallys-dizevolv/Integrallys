import { useState } from 'react';
import { NovoPacienteModal } from '../modals/NovoPacienteModal';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface NovoPacienteViewProps {
    onPageChange?: (page: string) => void;
}

export function NovoPacienteView({ onPageChange }: NovoPacienteViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleClose = () => {
        setIsModalOpen(false);
        onPageChange?.('pacientes');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => onPageChange?.('pacientes')}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
                <h1 className="text-2xl font-normal text-app-text-primary dark:text-white">
                    Novo Paciente
                </h1>
            </div>
            <NovoPacienteModal isOpen={isModalOpen} onClose={handleClose} />
        </div>
    );
}
