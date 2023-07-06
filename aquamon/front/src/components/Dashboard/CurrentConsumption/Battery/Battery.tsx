export default BatteryGauge;

import { Box, useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';

function BatteryGauge({ value }: { value: string }) {
  const theme = useMantineTheme();
  const [color, setColor] = useState(theme.colors.green[6]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor((prevColor) =>
        prevColor === theme.colors.green[6]
          ? theme.colors.green[9]
          : theme.colors.green[6]
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Box
      style={{
        border: '8px solid #1A2F48',
        width: 100,
        height: 160,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        style={{
          width: '96%',
          height: '96%',
          background: `linear-gradient(to top, ${color}, ${theme.colors.green[6]} ${value}%, #fff ${value}%, #fff)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>
          <span style={{ fontSize: '38px', color: '#1A2F48' }}>
            {Number(value).toFixed(0)}
          </span>
          <span style={{ fontSize: `${38 * 0.6}px`, color: '#1A2F48' }}>%</span>
        </span>
      </Box>
    </Box>
  );
}
