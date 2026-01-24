import { ObjectId } from "mongodb"

export default class Transaction {
    constructor(
        public name: string, 
        public amount: number, 
        public party: string[],
        public category?: string, 
        public description?: string,
        public id?: ObjectId
    ) {}
}