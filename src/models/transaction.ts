import { Schema, Types, model } from "mongoose"
import { createId } from '@paralleldrive/cuid2'

export interface ISplits {
  userId: Types.ObjectId,
  amount: number
}

export interface ITransaction extends Document {
  _id: Types.ObjectId,
  transactionId: string,
  description: string,
  category: string,
  totalAmount: number,
  currency: string,
  date: Date,
  payer: string,
  involvedParticipants: string[],
  splits: ISplits[],
  isPayment: boolean,
  groupId: string
}

const SplitSchema = new Schema<ISplits>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true } 
}, { _id: false })

const TransactionSchema = new Schema<ITransaction>({
  transactionId: { 
    type: String, 
    default: () => createId(),
    required: true, 
    unique: true
  },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, default: 'General' },
  totalAmount: { 
    type: Number, 
    min: [1, 'Amount must be positive'],
    required: true 
  },
  currency: { type: String, required: true, default: 'USD' },
  date: { type: Date, default: Date.now },

  payer: { type: String, ref: 'User', required: true },

  involvedParticipants: [ {type: String} ],

  // The individual shares
  splits: {
    type: [SplitSchema],
    validate: {
      validator: function(splits: any[]) {
        const sum = splits.reduce((acc, curr) => acc + curr.amount, 0)
        return sum === 0
      },
      message: 'Accounting Error: The sum of split balances must equal zero.'
    }
  },

  // Helps distinguish between an expense and a payment
  isPayment: { type: Boolean, default: false },

  // Optional Group name
  groupId: { type: String }
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
})

// create index for fast lookups
TransactionSchema.index({ payer: 1 })
TransactionSchema.index({ date: -1 })
TransactionSchema.index({ transactionId: 1 })

export const Transaction = model<ITransaction>('Transaction', TransactionSchema)
