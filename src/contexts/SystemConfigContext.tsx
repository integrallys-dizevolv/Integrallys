import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mapeamento de timezone IDs para IANA timezone strings
const TIMEZONE_MAP: Record<string, string> = {
    'america/sao_paulo': 'America/Sao_Paulo',
    'america/new_york': 'America/New_York',
    'europe/london': 'Europe/London',
    'asia/tokyo': 'Asia/Tokyo',
};

interface SystemConfig {
    timezone: string;
    currency: string;
}

interface SystemConfigContextType {
    config: SystemConfig;
    setTimezone: (timezone: string) => void;
    setCurrency: (currency: string) => void;
    getIANATimezone: () => string;
}

const defaultConfig: SystemConfig = {
    timezone: 'america/sao_paulo',
    currency: 'brl',
};

const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export function SystemConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<SystemConfig>(defaultConfig);

    const setTimezone = (timezone: string) => {
        setConfig(prev => ({ ...prev, timezone }));
    };

    const setCurrency = (currency: string) => {
        setConfig(prev => ({ ...prev, currency }));
    };

    const getIANATimezone = (): string => {
        return TIMEZONE_MAP[config.timezone] || 'America/Sao_Paulo';
    };

    return (
        <SystemConfigContext.Provider value={{ config, setTimezone, setCurrency, getIANATimezone }}>
            {children}
        </SystemConfigContext.Provider>
    );
}

export function useSystemConfig() {
    const context = useContext(SystemConfigContext);
    if (context === undefined) {
        throw new Error('useSystemConfig must be used within a SystemConfigProvider');
    }
    return context;
}
