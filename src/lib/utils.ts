import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { NetworkType, OrderStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  }).format(amount);
};
export const safeDate = (d?: string | null) =>
  d && !isNaN(new Date(d).getTime()) ? new Date(d) : null;
// export const formatDate = (dateString: string): string => {
//   return new Intl.DateTimeFormat('en-GH', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   }).format(new Date(dateString));
// };
export const formatDate = (dateString?: string | null): string => {
  const date = safeDate(dateString);
  if (!date) return 'N/A';

  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
export const isValidGhanaPhone = (phone: string): boolean => {
  return /^0[0-9]{9}$/.test(phone);
};

export const detectNetwork = (phone: string): NetworkType | null => {
  if (!isValidGhanaPhone(phone)) return null;
  const prefix = phone.substring(0, 4);

  const mtnPrefixes = ['0550', '0551', '0552', '0553', '0554', '0555', '0556', '0557', '0558', '0559',
    '0240', '0241', '0242', '0243', '0244', '0245', '0246', '0247', '0248', '0249',
    '0590', '0591', '0592', '0593', '0594', '0595', '0596', '0597', '0598', '0599',
    '0260', '0261', '0262', '0263', '0264', '0265', '0266', '0267', '0268', '0269',
    '0540', '0541', '0542', '0543', '0544', '0545', '0546', '0547', '0548', '0549',
    '0230', '0231', '0232', '0233', '0234', '0235', '0236', '0237', '0238', '0239',
  ];
  const airteltigoPrefixes = ['0260', '0261', '0262', '0263', '0264', '0265', '0266', '0267', '0268', '0269',
    '0270', '0271', '0272', '0273', '0274', '0275', '0276', '0277', '0278', '0279',
    '0570', '0571', '0572', '0573', '0574', '0575', '0576', '0577', '0578', '0579',
    '0280', '0281', '0282', '0283', '0284', '0285', '0286', '0287', '0288', '0289',
  ];
  const telecelPrefixes = ['0202', '0203', '0204', '0205', '0206', '0207', '0208', '0209',
    '0210', '0211', '0212', '0213', '0214', '0215', '0216', '0217', '0218', '0219',
    '0501', '0502', '0503', '0504', '0505', '0506', '0507', '0508', '0509',
    '0200', '0201',
  ];

  if (mtnPrefixes.some(p => prefix.startsWith(p.substring(0, 4)))) return 'mtn';
  if (airteltigoPrefixes.some(p => prefix.startsWith(p.substring(0, 4)))) return 'airteltigo';
  if (telecelPrefixes.some(p => prefix.startsWith(p.substring(0, 4)))) return 'telecel';
  return null;
};

export const networkDisplayName: Record<string, string> = {
  mtn: 'MTN',
  airteltigo: 'AirtelTigo',
  telecel: 'Telecel',
  WASSCE: 'WASSCE',
  BECE: 'BECE',
};

export const networkColors: Record<string, string> = {
  mtn: 'bg-yellow-400 text-yellow-900',
  airteltigo: 'bg-red-500 text-white',
  telecel: 'bg-red-600 text-white',
  WASSCE: 'bg-green-600 text-white',
  BECE: 'bg-purple-600 text-white',
};

export const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};
