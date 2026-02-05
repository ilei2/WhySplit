import { stringify } from 'csv-stringify'
import { Response } from 'express'
import { IUser } from '../models/User'
import { ITransaction, Transaction } from '../models/transaction'

interface CSVOptions {
  filename: string
  columns: string[]
}

// 2. Set headers for file download
// 3. Sets up stringifier
export const initializeCSVStream = (res: Response, { filename, columns }: CSVOptions) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)

  const stringifier = stringify({ header: true, columns })
  stringifier.pipe(res)

  return stringifier
}

export function createRow(tx: ITransaction) {
    return {
        Date: tx.date.toISOString().split('T')[0], // YYYY-MM-DD format 
        Description: tx.description,
        Category: tx.category || 'General',
        Cost: tx.totalAmount / 100, // Converting cents to decimal
        Currency: 'USD'
    }
}