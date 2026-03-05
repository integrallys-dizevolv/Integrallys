import { useState, useCallback } from 'react'
import { Appointment, Patient, AppointmentStatus } from '../context/types'

export const useSchedule = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([
        {
            id: '1',
            patientId: 'p1',
            patientName: 'Maria Silva',
            specialistId: 's1',
            specialistName: 'Dr. Adelmo',
            time: '09:00',
            date: new Date().toISOString(),
            status: 'confirmed',
            paymentStatus: 'pending',
            totalValue: 350,
            procedure: 'Consulta VIP'
        },
        {
            id: '2',
            patientId: 'p2',
            patientName: 'João Pereira',
            specialistId: 's1',
            specialistName: 'Dr. Adelmo',
            time: '10:00',
            date: new Date().toISOString(),
            status: 'waiting',
            paymentStatus: 'paid',
            totalValue: 250,
            procedure: 'Retorno'
        }
    ])

    const validatePatientData = (patient: Patient) => {
        // RN-003: CPF, Phone and Source are mandatory
        if (!patient.cpf || !patient.phone || !patient.source) {
            return {
                valid: false,
                missing: [
                    !patient.cpf && 'CPF',
                    !patient.phone && 'Telefone',
                    !patient.source && 'Indicação'
                ].filter(Boolean)
            }
        }
        return { valid: true }
    }

    const checkReturnRule = (lastVisit: string) => {
        // RN-019: 35-day return rule
        const lastDate = new Date(lastVisit)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays <= 35
    }

    const updateStatus = useCallback((id: string, newStatus: AppointmentStatus) => {
        setAppointments(prev => prev.map(app => {
            if (app.id === id) {
                // Sincronização de Status: Check-in -> Waiting
                return { ...app, status: newStatus }
            }
            return app
        }))

        if (newStatus === 'waiting') {
            console.log('SYNC: Notificando Especialista - Paciente em Espera.')
        }
    }, [])

    return { appointments, validatePatientData, checkReturnRule, updateStatus }
}
