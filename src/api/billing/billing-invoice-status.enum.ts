/** Where an invoice stands. An invoice is a snapshot: its lines never change after it is issued. */
export enum BillingInvoiceStatus {
    OPEN = 'open',
    PAID = 'paid',
    VOID = 'void',
}
