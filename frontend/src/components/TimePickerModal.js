// Time picker custom sin librerias nativas. Selector de hora/minuto
// con botones - / +. Snaps cada 5 minutos para evitar valores raros.
import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';

function pad(n) {
  return String(n).padStart(2, '0');
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function TimePickerModal({ visible, initial, onClose, onConfirm }) {
  const [hour, setHour] = useState(initial?.hour ?? 8);
  const [minute, setMinute] = useState(initial?.minute ?? 0);

  useEffect(() => {
    if (visible) {
      setHour(initial?.hour ?? 8);
      setMinute(initial?.minute ?? 0);
    }
  }, [visible, initial]);

  const handleConfirm = () => {
    onConfirm({ hour, minute, label: `${pad(hour)}:${pad(minute)}` });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(15,26,12,0.55)',
          justifyContent: 'flex-end',
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 12,
            paddingBottom: 30,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#d6d9cf',
              marginBottom: 14,
            }}
          />
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 18,
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Elige la hora
          </Text>
          <Text
            style={{
              color: COLORS.ink500,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            El animal será alimentado todos los días a esta hora
          </Text>

          <View className="flex-row justify-center items-center" style={{ marginBottom: 18 }}>
            {/* Hora */}
            <View className="items-center" style={{ width: 110 }}>
              <Text
                style={{
                  color: COLORS.ink500,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Hora
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.bg,
                  borderRadius: 18,
                  paddingVertical: 16,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.ink900,
                    fontSize: 44,
                    fontWeight: '800',
                  }}
                >
                  {pad(hour)}
                </Text>
              </View>
              <View className="flex-row justify-between" style={{ width: '100%' }}>
                <Pressable
                  onPress={() => setHour((h) => (h - 1 + 24) % 24)}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? COLORS.brand100 : COLORS.brand50,
                    borderRadius: 14,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginRight: 6,
                  })}
                >
                  <Text style={{ color: COLORS.brand700, fontWeight: '800', fontSize: 48 }}>−</Text>
                </Pressable>
                <Pressable
                  onPress={() => setHour((h) => (h + 1) % 24)}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? COLORS.brand100 : COLORS.brand50,
                    borderRadius: 14,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginLeft: 6,
                  })}
                >
                  <Text style={{ color: COLORS.brand700, fontWeight: '800', fontSize: 48 }}>+</Text>
                </Pressable>
              </View>
            </View>

            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 44,
                fontWeight: '800',
                marginHorizontal: 14,
              }}
            >
              :
            </Text>

            {/* Minutos */}
            <View className="items-center" style={{ width: 110 }}>
              <Text
                style={{
                  color: COLORS.ink500,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Minutos
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.bg,
                  borderRadius: 18,
                  paddingVertical: 16,
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.ink900,
                    fontSize: 44,
                    fontWeight: '800',
                  }}
                >
                  {pad(minute)}
                </Text>
              </View>
              <View className="flex-row justify-between" style={{ width: '100%' }}>
                <Pressable
                  onPress={() => {
                    const idx = MINUTES.indexOf(minute);
                    const next = MINUTES[(idx - 1 + MINUTES.length) % MINUTES.length];
                    setMinute(next);
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? COLORS.brand100 : COLORS.brand50,
                    borderRadius: 14,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginRight: 6,
                  })}
                >
                  <Text style={{ color: COLORS.brand700, fontWeight: '800', fontSize: 48 }}>−</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const idx = MINUTES.indexOf(minute);
                    const next = MINUTES[(idx + 1) % MINUTES.length];
                    setMinute(next);
                  }}
                  style={({ pressed }) => ({
                    flex: 1,
                    backgroundColor: pressed ? COLORS.brand100 : COLORS.brand50,
                    borderRadius: 14,
                    paddingVertical: 18,
                    alignItems: 'center',
                    marginLeft: 6,
                  })}
                >
                  <Text style={{ color: COLORS.brand700, fontWeight: '800', fontSize: 48 }}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="flex-row">
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                backgroundColor: COLORS.bg,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
                marginRight: 6,
              }}
            >
              <Text style={{ color: COLORS.ink700, fontWeight: '700', fontSize: 14 }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={{
                flex: 1,
                backgroundColor: COLORS.brand500,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: 'center',
                marginLeft: 6,
              }}
            >
              <Text style={{ color: COLORS.ink900, fontWeight: '800', fontSize: 14 }}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}