import { PurchaseModel } from "@/domain/models";

export interface LoadPurchases {
    loadAll: () => Promise<Array<PurchaseModel.Params>>
}
