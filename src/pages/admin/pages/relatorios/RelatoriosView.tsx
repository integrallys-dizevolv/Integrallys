import React from 'react'
import { RelatoriosView as GestorRelatoriosView } from '@/pages/gestor/pages/relatorios/RelatoriosView'

interface RelatoriosViewProps {
  setCurrentPage?: (page: string) => void
}

export function RelatoriosView({ setCurrentPage }: RelatoriosViewProps = {}) {
  return <GestorRelatoriosView onPageChange={setCurrentPage} />
}
