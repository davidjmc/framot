import {
  Divider,
  Group,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { BiBattery } from 'react-icons/bi';
import { MdOutlineWaterDrop } from 'react-icons/md';
import BatteryGauge from './Battery/Battery';
import { LiquidGauge } from './LiquidGauge/LiquidGaugue';

export const CurrentConsumption = ({
  percentage,
  battery,
}: {
  percentage: string;
  battery: string;
}) => {
  const theme = useMantineTheme();

  return (
    <Paper shadow="xl" p="xl" style={{ minHeight: '300px', minWidth: '400px' }}>
      <Title order={3} color="#EF4B3B">
        Current Consumption
      </Title>
      <Divider mt="md" mb="md" />
      <Group spacing="4rem">
        <Stack align="center">
          <Group spacing={'xs'}>
            <MdOutlineWaterDrop color={theme.colors.blue[8]} size={28} />
            <Title order={5}>Water Level</Title>
          </Group>
          <LiquidGauge value={percentage} />
        </Stack>
        <Stack align="center">
          <Group spacing={'xs'}>
            <BiBattery color={theme.colors.green[6]} size={28} />
            <Title order={5}>Battery Level</Title>
          </Group>
          <BatteryGauge value={battery} />
        </Stack>
      </Group>
    </Paper>
  );
};
