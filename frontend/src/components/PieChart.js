// Dona / pie chart hecho a mano con react-native-svg. No requiere
// librerias externas. data: [{ label, value, color }].
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const polarToCartesian = (cx, cy, r, angleDeg) => {
  // 0deg arriba, sentido horario
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

export default function PieChart({
  data = [],
  size = 200,
  innerRatio = 0.6,
  totalLabel = 'Total',
  totalUnit = 'kg',
}) {
  const total = data.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = r * innerRatio;

  // Construye segmentos
  let cumulative = 0;
  const segments = data
    .filter((d) => (d.value || 0) > 0)
    .map((d) => {
      const startAngle = total > 0 ? (cumulative / total) * 360 : 0;
      cumulative += d.value;
      const endAngle = total > 0 ? (cumulative / total) * 360 : 0;
      return { ...d, startAngle, endAngle };
    });

  const empty = total <= 0;

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G>
          {empty ? (
            <Circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#eef0e8"
              strokeWidth={r - innerR}
            />
          ) : (
            segments.map((s, i) => {
              // Si el segmento cubre todo, dibujamos circulo (path con M-L-A colapsa)
              if (s.endAngle - s.startAngle >= 359.999) {
                return (
                  <Circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={s.color}
                  />
                );
              }
              return (
                <Path
                  key={i}
                  d={arcPath(cx, cy, r, s.startAngle, s.endAngle)}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            })
          )}
        </G>
        {/* Hueco central (dona) */}
        <Circle cx={cx} cy={cy} r={innerR} fill="#fff" />
        <Circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke="#eef0e8"
          strokeWidth={1}
        />
      </Svg>

      {/* Texto en el centro */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pointerEvents="none"
      >
        <Text
          style={{
            color: COLORS.ink500,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {totalLabel}
        </Text>
        <Text
          style={{
            color: COLORS.ink900,
            fontSize: 24,
            fontWeight: '800',
            marginTop: 2,
          }}
        >
          {Math.round(total * 10) / 10}
          <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.ink500 }}>
            {' '}
            {totalUnit}
          </Text>
        </Text>
      </View>
    </View>
  );
}