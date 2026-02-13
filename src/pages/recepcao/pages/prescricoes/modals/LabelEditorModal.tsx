

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Printer, ChevronLeft, ChevronRight } from 'lucide-react'

export interface LabelData {
    patientName: string
    productName: string
    composition: string
    usage: string
    validity: string
    batch?: string
}

interface LabelEditorModalProps {
    isOpen: boolean
    onClose: () => void
    data?: LabelData
    dataList?: LabelData[]
}

export function LabelEditorModal({ isOpen, onClose, data, dataList }: LabelEditorModalProps) {
    const [currentData, setCurrentData] = useState<LabelData>({
        patientName: '',
        productName: '',
        composition: '',
        usage: '',
        validity: '',
        batch: ''
    })
    const [currentIndex, setCurrentIndex] = useState(0)
    const [mode, setMode] = useState<'single' | 'batch'>('single')
    const [localList, setLocalList] = useState<LabelData[]>([])

    // Initialize state when props change
    useEffect(() => {
        if (dataList && dataList.length > 0) {
            setMode('batch')
            const listWithBatches = dataList.map(item => ({
                ...item,
                batch: item.batch || Math.floor(10000 + Math.random() * 90000).toString()
            }))
            setLocalList(listWithBatches)
            setCurrentData(listWithBatches[0])
            setCurrentIndex(0)
        } else if (data) {
            setMode('single')
            const dataWithBatch = {
                ...data,
                batch: data.batch || Math.floor(10000 + Math.random() * 90000).toString()
            }
            setCurrentData(dataWithBatch)
            setLocalList([dataWithBatch])
        }
    }, [data, dataList, isOpen])

    // Handle navigation in batch mode
    const handleNext = () => {
        if (localList && currentIndex < localList.length - 1) {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            setCurrentData(localList[nextIndex])
        }
    }

    const handlePrev = () => {
        if (localList && currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentIndex(prevIndex)
            setCurrentData(localList[prevIndex])
        }
    }

    const handleUpdateField = (field: keyof LabelData, value: string) => {
        const updated = { ...currentData, [field]: value }
        setCurrentData(updated)

        const newList = [...localList]
        newList[currentIndex] = updated
        setLocalList(newList)
    }

    const handlePrint = () => {
        const itemsToPrint = mode === 'batch' ? localList : [currentData]

        // Load preferences
        const profile = localStorage.getItem('pref_printer_profile') || 'thermal_60x40'
        const marginTop = localStorage.getItem('pref_print_margin_top') || '0'
        const marginLeft = localStorage.getItem('pref_print_margin_left') || '0'

        // Build HTML for all items - EXACTLY matching the preview layout
        const printContentHTML = itemsToPrint.map(item => `
            <div class="label-container" style="page-break-after: always; padding: 4mm; padding-top: calc(3mm + ${marginTop}mm); padding-left: calc(4mm + ${marginLeft}mm); width: 60mm; height: 40mm; display: flex; flex-direction: column; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; background: white; color: black; position: relative;">
                
                <!-- Header / Branding -->
                <div style="display: flex; align-items: center; margin-bottom: 4mm; border-bottom: 1px solid #0039A6; padding-bottom: 2mm; width: 100%;">
                    <div style="background-color: #0039A6; color: white; width: 6mm; height: 6mm; display: flex; align-items: center; justify-content: center; border-radius: 1mm; font-weight: bold; font-size: 9pt; line-height: 1; margin-right: 2.5mm;">I</div>
                    <span style="font-weight: bold; font-size: 11pt; color: #101828; line-height: 1;">Integrallys</span>
                </div>

                <!-- Usage Section (Main Focus) -->
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; margin-bottom: 2mm;">
                    <p style="font-size: 8pt; font-weight: bold; margin: 0 0 1.5mm 0; color: #0039A6; text-transform: lowercase; letter-spacing: 0.5px;">modo de uso</p>
                    <p style="font-size: 10.5pt; margin: 0; line-height: 1.4; color: #101828; font-weight: normal; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;">${item.usage}</p>
                </div>

                <!-- Subtle Footer -->
                <div style="margin-top: auto; border-top: 0.2mm solid #f2f4f7; padding-top: 1.5mm; display: flex; justify-content: center;">
                    <p style="font-size: 6pt; margin: 0; color: #667085; letter-spacing: 1px;">integrallys.com</p>
                </div>
            </div>
        `).join('')

        const iframe = document.createElement('iframe')
        iframe.style.position = 'absolute'
        iframe.style.top = '-9999px'
        iframe.style.width = '0'
        iframe.style.height = '0'
        document.body.appendChild(iframe)

        const doc = iframe.contentWindow?.document
        if (doc) {
            doc.open()
            doc.write(`
                <html>
                    <head>
                        <title>Etiqueta</title>
                        <style>
                            @page {
                                size: 60mm 40mm;
                                margin: 0;
                            }
                            @media print {
                                html, body {
                                    width: 60mm;
                                    height: 40mm;
                                    margin: 0;
                                    padding: 0;
                                }
                                .label-container {
                                    width: 60mm;
                                    height: 40mm;
                                    page-break-after: always;
                                    overflow: hidden;
                                }
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                font-family: 'Inter', -apple-system, sans-serif;
                                background: white;
                            }
                            * {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                                box-sizing: border-box;
                            }
                        </style>
                    </head>
                    <body>
                        ${printContentHTML}
                    </body>
                </html>
            `)
            doc.close()
            iframe.contentWindow?.focus()
            setTimeout(() => {
                iframe.contentWindow?.print()
                document.body.removeChild(iframe)
            }, 500)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[500px] w-full bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark text-app-text-primary dark:text-white rounded-[24px] p-0 overflow-hidden shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Editor Form */}
                    <div className="w-full p-6 space-y-5">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-xl font-normal text-gray-900 dark:text-white">
                                        Editor de rótulos {mode === 'batch' && `(${currentIndex + 1}/${localList.length})`}
                                    </DialogTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-1">Dados da etiqueta (60x40mm)</p>
                                </div>
                                {mode === 'batch' && (
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="h-8 w-8 border-gray-200 dark:border-app-border-dark bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === localList.length - 1} className="h-8 w-8 border-gray-200 dark:border-app-border-dark bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700 dark:text-gray-300 font-bold text-sm uppercase tracking-wider">Modo de uso (Texto do Rótulo)</Label>
                                <Textarea
                                    value={currentData.usage}
                                    onChange={(e) => handleUpdateField('usage', e.target.value)}
                                    className="bg-white dark:bg-[#020817] border-gray-200 dark:border-app-border-dark text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-[#0039A6] rounded-2xl min-h-[160px] font-normal resize-none p-5 text-base leading-relaxed shadow-sm"
                                    placeholder="Descreva aqui o modo de uso que aparecerá no rótulo..."
                                />
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                                    Nota: Apenas o texto acima e a marca Integrallys serão incluídos na impressão final.
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-11 border-gray-200 dark:border-app-border-dark bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 font-normal rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                                >
                                    cancelar
                                </Button>
                                <Button
                                    onClick={handlePrint}
                                    className="flex-1 h-11 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl shadow-lg shadow-[#0039A6]/20 flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <Printer className="h-4 w-4 shrink-0" />
                                    {mode === 'batch' ? 'imprimir todos' : 'imprimir rótulo'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
