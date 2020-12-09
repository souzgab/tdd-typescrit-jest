import { CacheStore } from '@/data/protocols/cache'
import { PurchaseModel } from '@/domain/models';
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
    actions: Array<CacheStoreSpy.Action> = []
    deleteKey: string
    insertKey: string
    insertValues: Array<PurchaseModel.Params> = []

    delete(key: string): void{
        this.actions.push(CacheStoreSpy.Action.delete);
        this.deleteKey = key
    }

    insert(key: string, value: any): void{
        this.actions.push(CacheStoreSpy.Action.insert);
        this.insertKey = key
        this.insertValues = value;
    }

    replace(key: string, value: any): void{
        this.delete(key)
        this.insert(key, value)
    }
    
    helperSimulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.delete)
            throw new Error() 
        })
    }
    
    helperSimulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.insert)
            throw new Error() 
        })
    }
}

export namespace CacheStoreSpy{
    export enum Action {
        delete,
        insert
    }
}