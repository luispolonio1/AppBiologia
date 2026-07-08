import { View, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Header({ title, subtitle }) {
  return (
    <View style={{ marginBottom: 18 }}>
      {subtitle ? (
        <Text
          style={{
            color: COLORS.ink500,
            fontSize: 13,
            marginBottom: 4,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
      <Text
        style={{
          color: COLORS.ink900,
          fontSize: 26,
          fontWeight: '800',
        }}
      >
        {title}
      </Text>
    </View>
  );
}
