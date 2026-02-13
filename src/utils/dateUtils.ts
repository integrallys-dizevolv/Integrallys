/**
 * Utilitários para manipulação de datas respeitando o fuso horário configurado
 */

// Mapeamento de timezone IDs para IANA timezone strings
const TIMEZONE_MAP: Record<string, string> = {
  "america/sao_paulo": "America/Sao_Paulo",
  "america/new_york": "America/New_York",
  "europe/london": "Europe/London",
  "asia/tokyo": "Asia/Tokyo",
};

// Chave do localStorage para persistência
const TIMEZONE_STORAGE_KEY = "system_timezone";

/**
 * Define o timezone atual do sistema (persiste no localStorage)
 */
export function setSystemTimezone(timezone: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
  }
}

/**
 * Obtém o timezone configurado do localStorage
 */
export function getConfiguredTimezone(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TIMEZONE_STORAGE_KEY) || "america/sao_paulo";
  }
  return "america/sao_paulo";
}

/**
 * Obtém o timezone IANA atual
 */
export function getIANATimezone(): string {
  const configuredTimezone = getConfiguredTimezone();
  return TIMEZONE_MAP[configuredTimezone] || "America/Sao_Paulo";
}

/**
 * Obtém a data atual no formato YYYY-MM-DD respeitando o fuso horário configurado
 */
export function getTodayDate(): string {
  const ianaTimezone = getIANATimezone();

  // Usa Intl.DateTimeFormat para obter a data no fuso correto
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA retorna no formato YYYY-MM-DD
  return formatter.format(new Date());
}

/**
 * Obtém a data e hora atual formatada no fuso horário configurado
 */
export function getCurrentDateTime(): string {
  const ianaTimezone = getIANATimezone();

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return formatter.format(new Date());
}

/**
 * Formata uma data ISO para exibição no formato brasileiro
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return "";

  const ianaTimezone = getIANATimezone();
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

/**
 * Formata uma data ISO para exibição com hora no formato brasileiro
 */
export function formatDateTimeBR(dateString: string): string {
  if (!dateString) return "";

  const ianaTimezone = getIANATimezone();
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: ianaTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatter.format(date);
}
