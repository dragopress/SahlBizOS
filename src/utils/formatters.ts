import { Language } from '../types';

export function formatMAD(amount: number, language: Language = 'fr'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }
  
  const formattedNumber = new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (language === 'ar') {
    return `${formattedNumber} د.م.`;
  }
  return `${formattedNumber} MAD`;
}

export function formatDate(dateString?: string, language: Language = 'fr'): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const locale = language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-GB' : 'fr-MA';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatPercent(value: number): string {
  return `${(value || 0).toFixed(1)}%`;
}

// Convert numbers to French words for Moroccan official invoices
const UNITS_FR = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const TENS_FR = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];

function convertUnderThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    n %= 100;
    if (hundreds === 1) str += 'cent ';
    else str += UNITS_FR[hundreds] + ' cents ';
  }
  if (n >= 20) {
    if (n >= 70 && n <= 79) {
      str += 'soixante-' + UNITS_FR[n - 60] + ' ';
    } else if (n >= 90 && n <= 99) {
      str += 'quatre-vingt-' + UNITS_FR[n - 80] + ' ';
    } else {
      str += TENS_FR[Math.floor(n / 10)] + ' ';
      if (n % 10 > 0) str += UNITS_FR[n % 10] + ' ';
    }
  } else if (n > 0) {
    str += UNITS_FR[n] + ' ';
  }
  return str.trim();
}

export function numberToWordsFrench(amount: number): string {
  if (amount === 0) return 'zéro Dirham';
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let result = '';
  let millions = Math.floor(integerPart / 1000000);
  let thousands = Math.floor((integerPart % 1000000) / 1000);
  let units = integerPart % 1000;

  if (millions > 0) {
    result += (millions === 1 ? 'un million ' : convertUnderThousand(millions) + ' millions ');
  }
  if (thousands > 0) {
    result += (thousands === 1 ? 'mille ' : convertUnderThousand(thousands) + ' mille ');
  }
  if (units > 0) {
    result += convertUnderThousand(units) + ' ';
  }

  result = result.trim() + (integerPart > 1 ? ' Dirhams' : ' Dirham');

  if (decimalPart > 0) {
    result += ' et ' + convertUnderThousand(decimalPart) + (decimalPart > 1 ? ' centimes' : ' centime');
  } else {
    result += ' et zéro centime';
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}
