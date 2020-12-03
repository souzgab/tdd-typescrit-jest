import { LocalSavePurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

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