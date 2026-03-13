import { randomBytes } from 'crypto';
import { TicketCodeStrategy } from './ticket-code.strategy';


/**
 * Generates ticket codes using cryptographically random bytes.
 * Format: 12-character alphanumeric (Bombo-style compatible).
 */
export class NanoidTicketCodeStrategy extends TicketCodeStrategy {
  private readonly alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly size = 12;

  generate(): string {
    const bytes = randomBytes(this.size);
    let result = '';
    for (let i = 0; i < this.size; i++) {
      result += this.alphabet[bytes[i] % this.alphabet.length];
    }
    return result;
  }
}
