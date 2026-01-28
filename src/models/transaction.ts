import { ObjectId } from "mongodb"
import { Schema, model, Types } from "mongoose"

// export default class Transaction {
//     constructor(
//         public name: string, 
//         public amount: number, 
//         public party: string[],
//         public category?: string, 
//         public description?: string,
//         public id?: ObjectId
//     ) {}
// }

interface ITransaction {
    description: string,
    category: string,
    totalAmount: number,
    currency: string,
    date: Date,
    paidBy: Types.ObjectId
    splits: {
        userId: Types.ObjectId,
        amount: number
    }
    isPayment: boolean
}

const TransactionSchema = new Schema<ITransaction>({
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'General' },
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  date: { type: Date, default: Date.now },
  
  // Reference to the User model
  paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // The individual shares
  splits: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true } 
  }],

  // Helps distinguish between a "Dinner Expense" and a "Settlement Payment"
  isPayment: { type: Boolean, default: false }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
})

// create index for fast lookups
TransactionSchema.index({"splits.userId": 1})
TransactionSchema.index({ date: -1 })

export const Transaction = model<ITransaction>('Transaction', TransactionSchema)