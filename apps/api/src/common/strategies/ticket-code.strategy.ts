/**
 * Strategy for ticket code generation (SOLID - Strategy Pattern).
 * Allows swapping implementations (e.g. UUID, nanoid, Bombo-style) without changing consumers.
 */
export abstract class TicketCodeStrategy {
  abstract generate(): string;
}
