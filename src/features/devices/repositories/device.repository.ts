import { Device } from '../domain/device.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepository {
    constructor(private dataSource: DataSource) {}

    async createDevice(device: Device): Promise<Device> {
        const deviceId = await this.dataSource.query(
            `INSERT INTO public.devices(
          ip, "deviceId", "userId", title, "lastActiveDate")
        VALUES (1$, 2$, 3$, 4$, 5$) returning deviceId`,
            [device.ip, device.deviceId, device.userId, device.title, device.lastActiveDate],
        );
        return deviceId[0];
    }

    async isDeviceExistByUserIdAndDeviceId(deviceId: string, userId: string): Promise<boolean> {
        return false;
    }

    async findDevice(deviceId: string): Promise<Device | null> {
        return null;
    }

    // async findAllUserDevices(userId: string) :Promise<DeviceViewModel[]>{
    //     return  DeviceModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean()
    // },

    async updateDeviceLastActiveDate(deviceId: string, lastActiveDate: string): Promise<boolean> {
        try {
            // вызовите метод слоя доступа к данным, который обновляет дату последней активности устройства
            await this.updateDeviceLastActiveDate(deviceId, lastActiveDate);

            return true; // вернуть true в случае успешного обновления
        } catch (error) {
            console.error('Ошибка при обновлении даты последней активности устройства:', error);
            return false; // вернуть false в случае ошибки
        }
        //Смотреть оператор NOT
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string): Promise<boolean> {
        return false;
    }

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        const query = `DELETE FROM public.devices
			  WHERE "deviceId" = $1`;
        const deleted = await this.dataSource.query(query, [deviceId]);
        if (!deleted) return false;
        return true;
    }
}
