import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UserRepository } from '../features/admin/users/repositories/user-repository';
import { DataSource } from 'typeorm';

@Controller('testing')
export class DelController {
    constructor(private dataSource: DataSource) {}
    @Delete('all-data')
    @HttpCode(204)
    async DeleteAllData() {
        await this.dataSource.query(`DELETE FROM public.devices CASCADE`);
        await this.dataSource.query(`DELETE FROM public.users CASCADE`);
    }
}
