// Iconos SVG custom minimalistas. Usa react-native-svg.
// Tamaños default 26x26, currentColor para que el padre controle el color.
import React from 'react';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';

const baseProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function StatsIcon({ color = '#5a6a55' }) {
  return (
    <Svg {...baseProps} stroke={color}>
      {/* Ejes */}
      <Line x1="4" y1="20" x2="20" y2="20" />
      <Line x1="4" y1="20" x2="4" y2="4" />
      {/* Barras */}
      <Rect x="7" y="12" width="3" height="8" rx="1" fill={color} stroke="none" opacity="0.35" />
      <Rect x="7" y="12" width="3" height="8" rx="1" />
      <Rect x="12" y="8" width="3" height="12" rx="1" fill={color} stroke="none" opacity="0.55" />
      <Rect x="12" y="8" width="3" height="12" rx="1" />
      <Rect x="17" y="5" width="3" height="15" rx="1" fill={color} stroke="none" opacity="0.85" />
      <Rect x="17" y="5" width="3" height="15" rx="1" />
    </Svg>
  );
}

export function FeedIcon({ color = '#5a6a55' }) {
  return (
    <Svg {...baseProps} stroke={color}>
      {/* Plato / bowl */}
      <Path d="M3 12h18a8 8 0 0 1-16 0z" fill={color} fillOpacity="0.18" />
      <Path d="M3 12h18a8 8 0 0 1-16 0z" />
      {/* Briznas de pasto / comida cayendo */}
      <Path d="M9 6c0 1.5 1 2 1 3.5" />
      <Path d="M12 4c0 2 1.5 2.5 1.5 4.5" />
      <Path d="M15 6c0 1.5 1 2 1 3.5" />
    </Svg>
  );
}

export function RefreshIcon({ color = '#5a6a55', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
      <Path d="M3 3v5h5" />
      <Path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
      <Path d="M21 21v-5h-5" />
    </Svg>
  );
}

export function ClockIcon({ color = '#5a6a55', size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function PlusIcon({ color = '#ffffff', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function CheckIcon({ color = '#ffffff', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12l5 5 11-11" />
    </Svg>
  );
}

export function TrashIcon({ color = '#ffffff', size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18" />
      <Path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <Line x1="10" y1="11" x2="10" y2="17" />
      <Line x1="14" y1="11" x2="14" y2="17" />
    </Svg>
  );
}

export function GearIcon({ color = '#5a6a55', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Svg>
  );
}

export function LeafIcon({ color = '#5e8a18', size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20 4c-7 0-13 4-13 11 0 2 1 4 2 5l1-1c-1-1-1-2-1-4 0-6 5-9 11-9 0 7-3 11-9 11-2 0-3 0-4-1l-1 1c1 1 3 2 5 2 7 0 11-6 11-13 0-1 0-2 0-2 0 0-1 0-2 0z" />
    </Svg>
  );
}