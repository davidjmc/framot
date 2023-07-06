import { Carousel } from '@mantine/carousel';
import {
  AppShell,
  Box,
  Button,
  Center,
  Flex,
  Header,
  Image,
  Navbar,
  RingProgress,
  Stack,
  Text,
  createStyles,
  getStylesRef,
  rem,
} from '@mantine/core';
import { DateTime } from 'luxon';
import { useContext, useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo-white.svg';
import { AppContext, IDevice } from '../../contexts/AppContext';
import useDevice from '../../services/useDevice';
import { CreateDeviceModal } from '../Dashboard/Modals/CreateDeviceModal/CreateDeviceModal';
import { DeviceCard } from './DeviceList/DeviceCard/DeviceCard';
import { DeviceList } from './DeviceList/DeviceList';

interface NavigationProps {
  children?: React.ReactNode;
}

const useStyles = createStyles(() => ({
  controls: {
    ref: getStylesRef('controls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  root: {
    '&:hover': {
      [`& .${getStylesRef('controls')}`]: {
        opacity: 1,
      },
    },
  },
}));

export const Navigation = ({ children }: NavigationProps) => {
  const { setDevices, setSelectedDevice } = useContext(AppContext);
  const { getAll } = useDevice();
  const { classes } = useStyles();

  const devicesQuery = useQuery(['allDevices'], getAll, {
    refetchInterval: 10 * 1000,
    onSuccess: (data) => {
      const newData = data.map((device: IDevice) => {
        return {
          ...device,
          minDate:
            device.aggregatedHistory.length &&
            DateTime.fromFormat(
              device.aggregatedHistory[0].date,
              'dd/MM/yy'
            ).toJSDate(),
          maxDate:
            device.aggregatedHistory.length &&
            DateTime.fromFormat(
              device.aggregatedHistory[device.aggregatedHistory.length - 1]
                ?.date,
              'dd/MM/yy'
            ).toJSDate(),
        };
      });
      setDevices(newData);
    },
  });

  const [progress, setProgress] = useState(0);

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prevProgress) => prevProgress + 1);
      } else {
        setProgress(0);
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <AppShell
      style={{ height: 'calc(100vh - 60px)', width: '100%' }}
      navbar={
        <Navbar
          width={{ base: 250 }}
          sx={{
            padding: '10px',
            backgroundColor: '#EEF1FF',
          }}
        >
          <Navbar.Section grow mx="-xs" px="xs">
            <Stack>
              <Button
                bg="#1A2F48"
                sx={{
                  ':hover': { backgroundColor: '#1A2F48' },
                }}
                onClick={() => setOpen(true)}
                leftIcon={<FiPlus />}
              >
                Register Device
              </Button>

              {devicesQuery.data && devicesQuery.data.length > 0 && (
                <DeviceList devices={devicesQuery.data} />
              )}
            </Stack>
          </Navbar.Section>

          <Navbar.Section>
            <Center>
              <RingProgress
                size={200}
                label={
                  <Text size="xs" align="center">
                    Reloading Data
                  </Text>
                }
                sections={[{ value: progress, color: '#1A2F48' }]}
              />
            </Center>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} bg="#1A2F48">
          <Flex
            justify="center"
            align="center"
            style={{ width: '100%', height: '100%', paddingLeft: 250 }}
          >
            <Link to="/">
              <Image
                width={180}
                radius="md"
                src={logo}
                onClick={() => {
                  setSelectedDevice(null);
                }}
              />
            </Link>
          </Flex>
        </Header>
      }
    >
      {children}
      <CreateDeviceModal onClose={handleClose} opened={open} />
    </AppShell>
  );
};
