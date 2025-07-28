export interface IPayment {
   transactionId: string;
   amount: number;
   status: 'pending' | 'successful' | 'failed' | 'refunded';
   paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet' | 'cash_on_delivery';
}