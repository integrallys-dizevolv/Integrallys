export interface SavedCard {
    id: string;
    type: 'visa' | 'mastercard' | 'amex';
    last4: string;
    holder: string;
    expiry: string;
    color: string;
    gradient: string;
}

export const MOCK_SAVED_CARDS: SavedCard[] = [
    {
        id: '1',
        type: 'visa',
        last4: '1234',
        holder: 'JOAO DA SILVA',
        expiry: '12/28',
        color: 'bg-blue-600',
        gradient: 'from-blue-500 to-blue-700'
    },
    {
        id: '2',
        type: 'mastercard',
        last4: '5678',
        holder: 'JOAO DA SILVA',
        expiry: '05/27',
        color: 'bg-orange-600',
        gradient: 'from-orange-500 to-red-600'
    },
];
