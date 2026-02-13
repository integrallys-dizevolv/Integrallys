// Cores da Identidade Visual Integrallys
// Baseadas na logo oficial

export const COLORS = {
  // Cor Primária - Azul da logo
  primary: {
    DEFAULT: '#0039A6',
    hover: '#002d82',
    light: '#0052cc',
    dark: '#002a75',
    50: '#e6f0ff',
    100: '#cce0ff',
    200: '#99c2ff',
    300: '#66a3ff',
    400: '#3385ff',
    500: '#0039A6', // Principal
    600: '#002d82',
    700: '#002266',
    800: '#001a4d',
    900: '#001133',
  },
  
  // Cor Secundária - Verde da logo (para detalhes/accentos)
  secondary: {
    DEFAULT: '#00B050',
    light: '#00d660',
    dark: '#008a3d',
  },
  
  // Cores antigas (para referência/remoção gradual)
  old: {
    green: '#244738',
    greenDark: '#1F382C',
    greenLight: '#1d3b2e',
  }
} as const;

// Mapeamento de substituição
export const COLOR_MIGRATION = {
  // Botões primários
  'bg-[#244738]': 'bg-[#0039A6]',
  'bg-[#1F382C]': 'bg-[#0039A6]',
  'bg-[#1d3b2e]': 'bg-[#002d82]', // hover
  'bg-[#15251f]': 'bg-[#002a75]', // hover darker
  'bg-[#1a3329]': 'bg-[#002d82]', // hover
  'bg-[#2d523f]': 'bg-[#0052cc]', // hover light
  
  // Botões verdes padrão
  'bg-green-600': 'bg-[#0039A6]',
  'bg-emerald-600': 'bg-[#0039A6]',
  'hover:bg-green-600': 'hover:bg-[#0039A6]',
  'hover:bg-emerald-600': 'hover:bg-[#0039A6]',
  
  // Textos e bordas
  'text-[#244738]': 'text-[#0039A6]',
  'border-[#244738]': 'border-[#0039A6]',
  'shadow-[#244738]': 'shadow-[#0039A6]',
  
  // Cores de destaque/acento (mantém verde ou muda para azul claro)
  'bg-[#027A48]': 'bg-[#0052cc]',
  'text-[#027A48]': 'text-[#0052cc]',
  
  // Badges verdes
  'bg-green-50': 'bg-blue-50',
  'text-green-700': 'text-blue-700',
  'bg-emerald-50': 'bg-blue-50',
  'text-emerald-700': 'text-blue-700',
  
  // Switch e toggles
  'data-[state=checked]:bg-[#244738]': 'data-[state=checked]:bg-[#0039A6]',
} as const;