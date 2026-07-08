import { View, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { ANIMALS_BY_ID } from '../constants/animals';

// Formatea un ISO string a "HH:MM" en horario local.
function formatTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '—';
  }
}

export default function StatCard({ data }) {
  const animal = ANIMALS_BY_ID[data.animal];
  if (!animal) return null;
  const hasData = data.feedCount > 0;

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#0f1a0c',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: animal.color,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginRight: 14,
          }}
        >
          <Image
            source={animal.image}
            style={{ width: 56, height: 56 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <Text style={{ color: COLORS.ink700, fontSize: 13 }}>Hoy</Text>
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 18,
              fontWeight: '700',
              marginTop: 2,
            }}
          >
            {animal.label}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.brand50,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text
            style={{ color: COLORS.brand700, fontWeight: '700', fontSize: 12 }}
          >
            {data.feedCount} veces
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: '#eef0e8',
          marginVertical: 14,
        }}
      />

      <View className="flex-row justify-between">
        <View>
          <Text style={{ color: COLORS.ink500, fontSize: 12 }}>Comida servida</Text>
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 22,
              fontWeight: '800',
              marginTop: 2,
            }}
          >
            {data.totalAmount}
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.ink500 }}>
              {' '}
              kg
            </Text>
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: COLORS.ink500,
              fontSize: 12,
              textAlign: 'right',
            }}
          >
            Última vez
          </Text>
          <Text
            style={{
              color: COLORS.ink700,
              fontSize: 15,
              fontWeight: '600',
              marginTop: 2,
            }}
          >
            {formatTime(data.lastFedAt)}
          </Text>
        </View>
      </View>

      {!hasData && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: COLORS.earth100,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: COLORS.earth400, fontSize: 12 }}>
            Aún no se ha alimentado a {animal.label.toLowerCase()} hoy.
          </Text>
        </View>
      )}
    </View>
  );
}
