import { CacheStore } from '@/data/protocols/cache'
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
    messages: Array<CacheStoreSpy.Message> = []
    deleteCallsCount = 0;
    insertCallsCount =0;
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

    delete(key: string): void{
        this.messages.push(CacheStoreSpy.Message.delete);
        this.deleteCallsCount++;
        this.deleteKey = key
    }

    insert(key: string, value: any): void{
        this.messages.push(CacheStoreSpy.Message.insert);
        this.insertCallsCount++;
        this.insertKey = key
        this.insertValues = value;
    }
    
    helperSimulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.delete)
            throw new Error() 
        })
    }
    
    helperSimulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.insert)
            throw new Error() 
        })
    }
}

export namespace CacheStoreSpy{
    export enum Message {
        delete,
        insert
    }
}