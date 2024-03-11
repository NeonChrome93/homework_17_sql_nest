import { Device } from '../domain/device.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesRepository {
    constructor() {}

    async createDevice(device: Device): Promise<Device> {
        return device;
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
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string): Promise<boolean> {
        return false;
    }

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        return false;
    }
}
