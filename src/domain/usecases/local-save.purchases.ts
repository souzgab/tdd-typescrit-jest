import { PurchaseModel } from "@/domain/models";

export interface SavePurchases {
    save: (purchases: Array<PurchaseModel.Params>) => Promise<void>
}

