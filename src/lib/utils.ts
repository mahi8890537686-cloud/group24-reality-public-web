import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatArea(area: number, unit: string): string {
  return `${area.toLocaleString('en-IN')} ${unit}`;
}

export function calculateEMI(
  principal: number,
  ratePercent: number,
  tenureYears: number
): number {
  const r = ratePercent / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}

export const BUSINESS_NAME = 'Group 24 Reality';
export const CONTACT_PERSON = 'Sunil Sangwan';
export const WHATSAPP_NUMBER = '+919266982400';
export const PHONE_NUMBER = '+91-92669-82400';
export const PHONE_HREF = 'tel:+919266982400';
export const WHATSAPP_HREF = `https://wa.me/919266982400`;
export const OFFICE_ADDRESS = 'Plot No. 6, Basai Enclave, Part 2, Sector 37C, Near Corona Optus, Gurugram, Haryana';
export const WEBSITE = 'www.group24reality.com';
export const INSTAGRAM = '@group24reality';

export function whatsappLink(message: string): string {
  return `https://wa.me/919266982400?text=${encodeURIComponent(message)}`;
}
