import { PurchaseModel } from "@/domain/models";
import { SavePurchases } from '@/domain/usecases';
import {CacheStore} from '@/data/protocols/cache';

export class LocalLoadPurchases implements SavePurchases{
    constructor(
        private readonly cacheStore: CacheStore,
        private readonly timestamp: Date
    ){}

    async save(purchases: Array<PurchaseModel.Params>) : Promise<void> {
        this.cacheStore.replace('purchases', {
            timestamp: this.timestamp,
            value: purchases
        })
    }
}