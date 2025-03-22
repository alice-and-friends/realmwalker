import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obfuscateEmail'
})
export class ObfuscateEmailPipe implements PipeTransform {
  transform(email: string | undefined): string {
    if (!email) return '';

    if (!email || !email.includes('@')) {
      return email; // Return unchanged if not a valid email
    }

    const [localPart, domain] = email.split('@');

    if (localPart.length <= 2) {
      return email; // Don't obfuscate very short local parts
    }

    const firstChar = localPart.charAt(0);
    const lastChar = localPart.charAt(localPart.length - 1);
    const obfuscatedPart = '*'.repeat(Math.max(localPart.length - 2, 3)); // At least 3 asterisks

    return `${firstChar}${obfuscatedPart}${lastChar}@${domain}`;
  }
}
