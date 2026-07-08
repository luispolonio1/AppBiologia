import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../api/client';
import { COLORS } from '../constants/colors';
import { ANIMALS } from '../constants/animals';
import { ClockIcon, PlusIcon, TrashIcon } from '../components/icons';
import TimePickerModal from '../components/TimePickerModal';

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return { hour: h, minute: m, label: t };
}

function AnimalScheduleRow({ animal, schedule, onAdd, onRemove, loading }) {
  const times = schedule?.times || [];
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
        shadowColor: animal.accent,
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center" style={{ marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: animal.color,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            overflow: 'hidden',
          }}
        >
          <Image
            source={animal.image}
            style={{ width: 42, height: 42 }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 17,
              fontWeight: '800',
            }}
          >
            {animal.label}
          </Text>
          <Text
            style={{
              color: COLORS.ink500,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {times.length === 0
              ? 'Sin horario automático'
              : `${times.length} ${times.length === 1 ? 'toma' : 'tomas'} al día · ${schedule.amount ?? animal.defaultAmount} kg`}
          </Text>
        </View>
      </View>

      {times.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 10,
          }}
        >
          {times.map((t) => (
            <View
              key={t}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: animal.color,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 14,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <ClockIcon color={COLORS.ink900} size={13} />
              <Text
                style={{
                  color: COLORS.ink900,
                  fontWeight: '800',
                  fontSize: 14,
                  marginLeft: 6,
                  marginRight: 8,
                }}
              >
                {t}
              </Text>
              <Pressable
                onPress={() => onRemove(t)}
                hitSlop={10}
                style={({ pressed }) => ({
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: pressed ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                <TrashIcon color={COLORS.ink900} size={12} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={onAdd}
        disabled={loading}
        style={({ pressed }) => ({
          backgroundColor: pressed ? COLORS.brand100 : COLORS.brand50,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: loading ? 0.6 : 1,
        })}
      ><View className="flex-row items-center">
            <PlusIcon color={COLORS.brand700} size={18} />
            <Text
              style={{
                color: COLORS.brand700,
                fontWeight: '800',
                fontSize: 14,
                marginLeft: 8,
                letterSpacing: 0.3,
              }}
            >
              Agregar horario
            </Text>
      </View>
      </Pressable>
    </View>
  );
}

export default function ScheduleScreen({ navigation }) {
  const [schedules, setSchedules] = useState({}); // { animal: { times, amount } }
  const [loading, setLoading] = useState(null); // animal.id cargando
  const [refreshing, setRefreshing] = useState(false);
  const [pickerAnimal, setPickerAnimal] = useState(null);
  const [pickerInitial, setPickerInitial] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getSchedules();
      const map = {};
      for (const a of ANIMALS) {
        const found = data.schedules.find((s) => s.animal === a.id);
        map[a.id] = found || { animal: a.id, times: [], amount: a.defaultAmount };
      }
      setSchedules(map);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los horarios');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const saveSchedule = async (animal, newTimes) => {
    try {
      setLoading(animal.id);
      const updated = await api.setSchedule(animal.id, newTimes, animal.defaultAmount);
      setSchedules((prev) => ({ ...prev, [animal.id]: updated }));
    } catch (e) {
      Alert.alert('Error', e.message || 'No se pudo guardar el horario');
    } finally {
      setLoading(null);
    }
  };

  const handleAddTime = (animal) => {
    setPickerAnimal(animal);
    setPickerInitial(null);
  };

  const handleRemoveTime = async (animal, time) => {
    const current = schedules[animal.id]?.times || [];
    const next = current.filter((t) => t !== time);
    Alert.alert(
      'Eliminar horario',
      `¿Quitar la toma de las ${time}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: () => saveSchedule(animal, next),
        },
      ]
    );
  };

  const handleConfirmTime = ({ label }) => {
    if (!pickerAnimal) return;
    const current = schedules[pickerAnimal.id]?.times || [];
    if (current.includes(label)) {
      Alert.alert('Horario duplicado', `Ya tienes ${label} configurado para ${pickerAnimal.label}.`);
      return;
    }
    const next = [...current, label].sort();
    setPickerAnimal(null);
    saveSchedule(pickerAnimal, next);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row items-center" style={{ marginBottom: 4 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={10}
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              shadowColor: '#0f1a0c',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 3,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text style={{ color: COLORS.ink900, fontSize: 36, fontWeight: '700', marginTop: -2 }}>←</Text>
          </Pressable>
          <View className="flex-1">
            <Text
              style={{
                color: COLORS.ink500,
                fontSize: 13,
                fontWeight: '500',
              }}
            >
              Configuración
            </Text>
            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 26,
                fontWeight: '800',
                marginTop: 2,
              }}
            >
              Horarios
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: COLORS.ink500,
            fontSize: 13,
            lineHeight: 19,
            marginTop: 8,
            marginBottom: 18,
          }}
        >
          Define a qué horas se alimentará cada animal automáticamente todos
          los días. El servidor registrará la toma por ti.
        </Text>

        {error && (
          <View
            style={{
              backgroundColor: '#fde4e4',
              padding: 12,
              borderRadius: 12,
              marginBottom: 14,
            }}
          >
            <Text style={{ color: COLORS.danger, fontSize: 13 }}>{error}</Text>
            <TouchableOpacity onPress={load} style={{ marginTop: 6 }}>
              <Text
                style={{
                  color: COLORS.danger,
                  fontWeight: '700',
                  fontSize: 13,
                }}
              >
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {ANIMALS.map((animal) => (
          <AnimalScheduleRow
            key={animal.id}
            animal={animal}
            schedule={schedules[animal.id]}
            onAdd={() => handleAddTime(animal)}
            onRemove={(t) => handleRemoveTime(animal, t)}
            loading={loading === animal.id}
          />
        ))}
      </ScrollView>

      <TimePickerModal
        visible={!!pickerAnimal}
        initial={pickerInitial}
        onClose={() => setPickerAnimal(null)}
        onConfirm={handleConfirmTime}
      />
    </SafeAreaView>
  );
}