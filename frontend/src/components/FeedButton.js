import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

export default function FeedButton({ animal, onPress, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => ({
        backgroundColor: animal.color,
        borderRadius: 28,
        padding: 18,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        transform: [{ scale: pressed ? 0.97 : 1 }],
        shadowColor: animal.accent,
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 6,
        opacity: loading ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
        }}
      >
        <Image
          source={animal.image}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1">
        <Text
          style={{
            color: COLORS.ink900,
            fontSize: 20,
            fontWeight: '800',
          }}
        >
          {animal.label}
        </Text>
        <Text
          style={{
            color: COLORS.ink700,
            fontSize: 13,
            marginTop: 2,
          }}
        >
          Servir {animal.defaultAmount} kg
        </Text>
      </View>

      <View
        style={{
          backgroundColor: animal.accent,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 999,
          minWidth: 84,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}
          >
            Alimentar
          </Text>
        )}
      </View>
    </Pressable>
  );
}
