import { ScrollArea } from '@mantine/core';
import { IDevice } from '../../../contexts/AppContext';
import { DeviceCard } from './DeviceCard/DeviceCard';

export const DeviceList = ({ devices }: { devices: IDevice[] }) => {
  return (
    <ScrollArea h={600}>
      {devices.map((device: IDevice) => {
        return (
          <DeviceCard uuid={device.id} name={device.name} key={device.id}/>
        );
      })}
    </ScrollArea>
  );
};
