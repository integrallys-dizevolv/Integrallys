// Utilitário para padronizar badges de status em todo o sistema Admin
// Cores sólidas e vivas para garantir contraste imediato

export const getStatusBadgeClass = (status: string): string => {
    const s = status.toLowerCase();

    // Status Positivos/Concluídos - Verde
    if (s.includes('ativo') || s.includes('ativa') || s.includes('concluído') || s.includes('concluido') ||
        s.includes('check-out') || s.includes('pago') || s.includes('aprovado') || s.includes('confirmado') ||
        s.includes('disponível') || s.includes('disponivel') || s.includes('online')) {
        return 'bg-emerald-600 dark:bg-emerald-900 text-white dark:text-emerald-100 border-none font-normal';
    }

    // Status Pendentes/Aguardando - Azul
    if (s.includes('pendente') || s.includes('agendado') || s.includes('confirmação') || s.includes('confirmacao') ||
        s.includes('check-in') || s.includes('aguardando')) {
        return 'bg-blue-600 dark:bg-blue-900 text-white dark:text-blue-100 border-none font-normal';
    }

    // Status Em Andamento/Processando - Roxo
    if (s.includes('andamento') || s.includes('atendimento') || s.includes('processando') || s.includes('em análise') ||
        s.includes('em analise')) {
        return 'bg-purple-600 dark:bg-purple-900 text-white dark:text-purple-100 border-none font-normal';
    }

    // Status Atenção/Parcial - Laranja/Âmbar
    if (s.includes('atraso') || s.includes('parcial') || s.includes('em aberto') || s.includes('vencendo') ||
        s.includes('atenção') || s.includes('atencao') || s.includes('manutenção') || s.includes('manutencao')) {
        return 'bg-amber-600 dark:bg-amber-900 text-white dark:text-amber-100 border-none font-normal';
    }

    // Status Negativos/Cancelados - Vermelho
    if (s.includes('cancelado') || s.includes('inativo') || s.includes('inativa') || s.includes('recusado') ||
        s.includes('erro') || s.includes('falha') || s.includes('bloqueado') || s.includes('não compareceu') ||
        s.includes('nao compareceu') || s.includes('ocupado')) {
        return 'bg-red-600 dark:bg-red-900 text-white dark:text-red-100 border-none font-normal';
    }

    // Status Neutros - Cinza
    return 'bg-gray-600 dark:bg-gray-800 text-white dark:text-gray-200 border-none font-normal';
};

// Função para formatar o texto do status (Sentence case)
export const formatStatusText = (status: string): string => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Função combinada para Badge completo
export const getStatusBadge = (status: string) => ({
    className: getStatusBadgeClass(status),
    text: formatStatusText(status)
});
