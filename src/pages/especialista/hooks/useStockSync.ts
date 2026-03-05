import { useState } from 'react'
import { ItemPrescrito } from '../context/types'

export const useStockSync = () => {
    const [isSyncing, setIsSyncing] = useState(false)

    const syncStock = async (prescritos: ItemPrescrito[]) => {
        if (prescritos.length === 0) return

        setIsSyncing(true)
        console.log('Iniciando Sincronização Ativa com o Estoque...')

        // Simulating API call to stock management and budgeting
        await new Promise(resolve => setTimeout(resolve, 1500))

        prescritos.forEach(item => {
            console.log(`Reserva realizada: ${item.nome} - Qtd: ${item.quantidade}`)
        })

        console.log('Orçamentação gerada automaticamente.')
        setIsSyncing(false)
    }

    return { syncStock, isSyncing }
}
