import { PurchaseModel } from "@/domain/models";
import faker from 'faker'

export const mockPurchases = (): Array<PurchaseModel.Params> => [{
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: faker.random.number()
}, {
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: faker.random.number()
}]
