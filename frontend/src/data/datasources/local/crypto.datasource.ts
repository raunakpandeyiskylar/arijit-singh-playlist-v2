import EncryptionRepository from "@/domain/repository/encryption.repository";
import {CryptoService} from "@/data/services/crypto.services";
import EncryptedDataEntity from "@/domain/entity/encryption.entity";

export class EncryptionDataSource implements EncryptionRepository {
    private cryptoService: CryptoService;

    constructor() {
        this.cryptoService = new CryptoService();
    }

    async encrypt(data: string): Promise<EncryptedDataEntity> {
        return this.cryptoService.encrypt(data);
    }

    async decrypt(encryptedData: EncryptedDataEntity): Promise<string> {
        return this.cryptoService.decrypt(encryptedData);
    }

    hash(data: string): string {
        return this.cryptoService.hash(data);
    }

    compareHash(data: string, hash: string): boolean {
        return this.cryptoService.compareHash(data, hash);
    }
}
