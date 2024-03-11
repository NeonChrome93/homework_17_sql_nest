import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../api/models/output/device-output.model';

@Injectable()
export class DevicesQueryRepository {
    constructor() {}
    async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
        // const device = await this.DeviceModel.find({ userId }, { _id: 0, userId: 0, __v: 0 }).lean();
        const device: DeviceViewModel[] = [];
        return device;
    }
}
