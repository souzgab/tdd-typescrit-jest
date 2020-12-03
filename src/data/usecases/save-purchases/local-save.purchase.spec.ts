import {CacheStore} from '@/data/protocols/cache';
import { LocalSavePurchases } from '@/data/usecases'
import {SavePurchases} from '@/domain/usecases/index'
import { mockPurchases } from '@/data/tests'
class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount =0;
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

    delete(key: string): void{
        this.deleteCallsCount++;
        this.deleteKey = key
    }

    insert(key: string, value: any): void{
        this.insertCallsCount++;
        this.insertKey = key
        this.insertValues = value;
    }
    
    helperSimulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {throw new Error() })
    }
    
    helperSimulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {throw new Error() })
    }
}

type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    return {sut, cacheStore}
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const {cacheStore} = makeSut()
        expect(cacheStore.deleteCallsCount).toBe(0)
    });

    test('Should not delete cache on sut.save', async () => {
        const {cacheStore, sut} = makeSut()
        await sut.save(mockPurchases())
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })
    
    test('Should not insert new cache if delete fails', () => {
        const {cacheStore, sut} = makeSut()
        cacheStore.helperSimulateDeleteError();
        const promise = sut.save(mockPurchases())
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })  

    test('Should insert new cache if delete succeeds', async () => {
        const {cacheStore, sut} = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })
    
    test('Should throw if insert throws', async () => {
        const {cacheStore, sut} = makeSut();
        cacheStore.helperSimulateDeleteError();
        const promise = sut.save(mockPurchases());
        expect(promise).rejects.toThrow()
    })  
});