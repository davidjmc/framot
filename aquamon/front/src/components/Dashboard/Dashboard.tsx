import { Flex, Group } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { AppContext, IDevice } from '../../contexts/AppContext';
import { CurrentConsumption } from './CurrentConsumption/CurrentoConsumption';
import { HistoryConsumption } from './HistoryConsumption/HistoryConsumption';
import { EditDeviceModal } from './Modals/EditDeviceModal/EditDeviceModal';
import { ReservatoryInformation } from './ReservatoryInformation/ReservatoryInformation';

export const Dashboard = () => {
  const { id } = useParams();
  const { devices } = useContext(AppContext);

  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [open, setOpen] = useState(false);

  const handleCloseModal = () => setOpen(false);
  const handleOpenModal = () => setOpen(true);

  useEffect(() => {
    if (devices.length) {
      const selected = devices.find((element) => element.id === id);

      if (selected) {
        setSelectedDevice(selected);
      }
    }
  }, [id, devices]);

  useEffect(() => {
    if (devices.length) {
      const selected = devices.find((element) => element.id === id);

      if (selected) {
        setSelectedDevice(selected);
      }
    }
  }, []);

  if (selectedDevice) {
    return (
      <Flex mih={50} gap="md" align="center" direction="column" wrap="wrap">
        <Group
          mb="xl"
          position="center"
          style={{ width: '100%', gap: '10rem' }}
        >
          <CurrentConsumption
            battery={String(selectedDevice.battery)}
            percentage={selectedDevice.percentage}
          />

          <ReservatoryInformation
            handleOpenModal={() => handleOpenModal()}
            address={selectedDevice.address}
            mac={selectedDevice.mac}
            baseRadius={selectedDevice.baseRadius}
            height={selectedDevice.height}
            maxCapacity={selectedDevice.maxCapacity}
            name={selectedDevice.name}
            water={selectedDevice.water}
            id={selectedDevice.id}
          />
        </Group>

        <HistoryConsumption
          aggregatedHistory={selectedDevice.aggregatedHistory}
          maxCapacity={selectedDevice.maxCapacity}
          maxDate={selectedDevice.maxDate}
          minDate={selectedDevice.minDate}
        />

        <EditDeviceModal
          opened={open}
          device={selectedDevice}
          onClose={handleCloseModal}
        />
      </Flex>
    );
  } else return <></>;
};
