import { Brackets, Repository } from "typeorm";
import { ITenant, TenantQueryParams } from "../types";
import { Tenant } from "../entities/Tenant";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async getAll(validatedQuery: TenantQueryParams) {
        // return await this.tenantRepository.find();
        const queryBuilder = this.tenantRepository.createQueryBuilder("tenant");

        if (validatedQuery.q) {
            const searchParams = `%${validatedQuery.q}%`;
            queryBuilder.where(
                new Brackets((qb) => {
                    qb.where(
                        "CONCAT(tenant.name, ' ',tenant.address) ILIKE :q",
                        {
                            q: searchParams,
                        },
                    );
                }),
            );
        }
        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy("tenant.id", "DESC")
            .getManyAndCount();

        return result;
    }

    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({
            where: { id: tenantId },
        });
    }

    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async deleteById(id: number) {
        return await this.tenantRepository.delete(id);
    }
}
