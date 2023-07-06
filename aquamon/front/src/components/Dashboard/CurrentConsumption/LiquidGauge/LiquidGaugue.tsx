import { useMantineTheme } from '@mantine/core';
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import LiquidFillGauge from 'react-liquid-gauge';

export const LiquidGauge = ({ value }: { value: string }) => {
  const theme = useMantineTheme();

  const radius = 80;
  const interpolate = interpolateRgb(
    theme.colors.blue[8],
    theme.colors.blue[8]
  );
  const fillColor = interpolate(Number(value) / 100);
  const gradientStops = [
    {
      key: '0%',
      stopColor: color(fillColor)?.darker(0.5).toString(),
      stopOpacity: 1,
      offset: '0%',
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%',
    },
    {
      key: '100%',
      stopColor: color(fillColor)?.brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: '100%',
    },
  ];

  return (
    <LiquidFillGauge
      style={{ margin: '0 auto' }}
      width={radius * 2}
      height={radius * 2}
      value={Number(value)}
      percent="%"
      textSize={1}
      textOffsetX={5}
      textOffsetY={10}
      textRenderer={(props: any) => {
        const value = Math.round(props.value);
        const radius = Math.min(props.height / 2, props.width / 2);
        const textPixels = (props.textSize * radius) / 2;
        const valueStyle = {
          fontSize: textPixels,
        };
        const percentStyle = {
          fontSize: textPixels * 0.6,
        };

        return (
          <tspan>
            <tspan className="value" style={valueStyle}>
              {value}
            </tspan>
            <tspan style={percentStyle}>{props.percent}</tspan>
          </tspan>
        );
      }}
      riseAnimation
      waveAnimation
      waveFrequency={3}
      waveAmplitude={5}
      gradient
      gradientStops={gradientStops}
      circleStyle={{
        fill: '#1A2F48',
      }}
      waveStyle={{
        fill: fillColor,
      }}
      textStyle={{
        fill: '#1A2F48',
        fontFamily: 'Arial',
      }}
      waveTextStyle={{
        fill: '#1A2F48',
        fontFamily: 'Arial',
      }}
    />
  );
};
