import { CSSProperties, ReactNode } from 'react';

export interface LiquidFillGaugeProps {
  id?: string;
  style:any;
  width?: number;
  height?: number;
  value?: number;
  percent?: string | ReactNode;
  textSize?: number;
  textOffsetX?: number;
  textOffsetY?: number;
  textRenderer?: (props: { value: number }) => ReactNode;
  riseAnimation?: boolean;
  riseAnimationTime?: number;
  riseAnimationEasing?: string;
  riseAnimationOnProgress?: (props: {
    value: number;
    container: HTMLElement;
  }) => void;
  riseAnimationOnComplete?: (props: {
    value: number;
    container: HTMLElement;
  }) => void;
  waveAnimation?: boolean;
  waveAnimationTime?: number;
  waveAnimationEasing?: string;
  waveAmplitude?: number;
  waveFrequency?: number;
  gradient?: boolean;
  gradientStops?: any;
  onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  innerRadius?: number;
  outerRadius?: number;
  margin?: number;
  circleStyle?: CSSProperties;
  waveStyle?: CSSProperties;
  textStyle?: CSSProperties;
  waveTextStyle?: CSSProperties;
}

declare class LiquidFillGauge extends React.Component<LiquidFillGaugeProps> {}

export default LiquidFillGauge;
