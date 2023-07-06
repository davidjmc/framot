import { Divider, Group, Paper, Title } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { DateTime } from 'luxon';
import { BsCalendar3 } from 'react-icons/bs';
import { HistoryChart } from './HistoryChart/HistoryChart';
import { useState } from 'react';

const filterData = (date: Date, data: any) => {
  if (!data) return [];
  return data.filter((item: any) => {
    return (
      DateTime.fromFormat(item.date, 'dd/MM/yy').month ===
        DateTime.fromJSDate(date).month &&
      DateTime.fromFormat(item.date, 'dd/MM/yy').year ===
        DateTime.fromJSDate(date).year
    );
  });
};

interface HistoryConsumptionProps {
  maxDate: Date;
  aggregatedHistory: any;
  maxCapacity: string;
  minDate: Date;
}

export const HistoryConsumption = ({
  aggregatedHistory,
  maxCapacity,
  maxDate,
  minDate,
}: HistoryConsumptionProps) => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Paper shadow="xl" p="xl">
      <Group w={'100%'} position="apart">
        <Title order={3} color="#EF4B3B">
          History Consumption
        </Title>
        <MonthPickerInput
          icon={<BsCalendar3 size="1.1rem" />}
          w={200}
          label="Select Month"
          value={date || maxDate}
          onChange={(value: Date) =>
            setDate(DateTime.fromJSDate(value).toJSDate())
          }
          minDate={minDate}
          maxDate={maxDate}
        />
      </Group>
      <Divider mt="md" mb="md" />
      <HistoryChart
        data={filterData(date || maxDate, aggregatedHistory)}
        maxCapacity={maxCapacity}
      />
    </Paper>
  );
};
