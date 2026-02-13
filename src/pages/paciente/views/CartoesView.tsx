import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react'
import { AdicionarCartaoModal } from '../modals/AdicionarCartaoModal'
import { EditarCartaoModal } from '../modals/EditarCartaoModal'
import { ExcluirCartaoModal } from '../modals/ExcluirCartaoModal'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { MOCK_SAVED_CARDS } from '@/mocks/paciente/cartoes'

interface CartoesViewProps {
    onPageChange: (page: string) => void
}

export function CartoesView({ onPageChange }: CartoesViewProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCardForDeletion, setSelectedCardForDeletion] = useState<string>('')
    const [selectedCardForEdit, setSelectedCardForEdit] = useState<any>(null)

    const savedCards = MOCK_SAVED_CARDS;


    const handleDeleteClick = (last4: string) => {
        setSelectedCardForDeletion(last4)
        setIsDeleteModalOpen(true)
    }

    const handleEditClick = (card: any) => {
        setSelectedCardForEdit({
            number: `**** **** **** ${card.last4}`,
            holder: card.holder,
            expiry: card.expiry,
            cvv: '123' // Mock CVV as it's not usually stored fully
        })
        setIsEditModalOpen(true)
    }



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Breadcrumb & Header */}
            <div className="flex flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => onPageChange('pagamentos')} className="cursor-pointer">Pagamentos</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Gerenciar Cartões</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Cartões</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seus cartões de crédito cadastrados</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-4 shrink-0 rounded-[10px]"
                            onClick={() => onPageChange('pagamentos')}
                        >
                            <ArrowLeft className="h-4 w-4 shrink-0" />
                            <span className="leading-none">Voltar</span>
                        </Button>
                        <Button
                            className="flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-4 shrink-0 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px]"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="h-5 w-5 shrink-0" />
                            <span className="leading-none">Adicionar Cartão</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {savedCards.map((card) => (
                    <div key={card.id} className="space-y-3 group">
                        {/* Simulation Card */}
                        <div className={`relative w-full aspect-[1.6/1] rounded-[20px] p-6 sm:p-8 shadow-md transition-transform duration-300 hover:scale-[1.02] overflow-hidden text-white bg-gradient-to-br ${card.gradient}`}>

                            {/* Chip */}
                            <div className="h-10 w-12 rounded bg-gradient-to-br from-yellow-200 to-yellow-500 mb-8 opacity-90 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 border border-yellow-600/20 rounded"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-yellow-600/30"></div>
                                <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-yellow-600/30"></div>
                                <div className="absolute right-1/3 top-0 bottom-0 w-[1px] bg-yellow-600/30"></div>
                            </div>

                            {/* Brand Logo (Simulated) */}
                            <div className="absolute top-6 right-8">
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                                    {card.type}
                                </div>
                            </div>

                            {/* Number */}
                            <div className="mt-auto">
                                <p className="font-mono text-xl sm:text-2xl tracking-widest drop-shadow-md">
                                    **** **** **** {card.last4}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 flex flex-row items-center justify-center gap-2 whitespace-nowrap h-11 px-4 shrink-0 rounded-[10px] hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => handleEditClick(card)}
                            >
                                <Edit2 className="h-4 w-4 shrink-0" />
                                <span className="leading-none">Editar</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-11 h-11 p-0 flex items-center justify-center shrink-0 rounded-[10px] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/50 dark:hover:bg-red-900/20"
                                onClick={() => handleDeleteClick(card.last4)}
                            >
                                <Trash2 className="h-4 w-4 shrink-0" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <AdicionarCartaoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditarCartaoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                cardData={selectedCardForEdit}
            />

            <ExcluirCartaoModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                cardLastDigits={selectedCardForDeletion}
            />
        </div>
    )
}
