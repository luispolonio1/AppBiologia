import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { api } from '../api/client';
import { COLORS } from '../constants/colors';
import { ANIMALS } from '../constants/animals';
import { ClockIcon, PlusIcon, LeafIcon, CheckIcon, GearIcon } from '../components/icons';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function todayLong() {
  return new Date().toLocaleDateString('es-EC', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function timeAgo(iso) {
  if (!iso) return 'sin registros hoy';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'recién';
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(iso).toLocaleDateString();
}

// Card grande con foto, gradiente, info y 100% presionable.
function AnimalCard({ animal, stats, schedule, onFeed, loading, justFed }) {
  const feedCount = stats?.feedCount ?? 0;
  const totalAmount = stats?.totalAmount ?? 0;
  const lastAt = stats?.lastFedAt;
  const scheduleTimes = schedule?.times || [];

  return (
    <Pressable
      onPress={onFeed}
      disabled={loading}
      style={({ pressed }) => ({
        borderRadius: 26,
        overflow: 'hidden',
        marginBottom: 18,
        backgroundColor: COLORS.white,
        shadowColor: animal.accent,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 6,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        opacity: loading ? 0.85 : 1,
      })}
    >
      <View style={{ height: 170, position: 'relative' }}>
        <Image
          source={animal.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.05)',
            'rgba(0,0,0,0.45)',
            animal.accent + 'EE',
          ]}
          locations={[0, 0.55, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: 16,
            justifyContent: 'space-between',
          }}
        >
          <View className="flex-row justify-between items-start">
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12 }}>{animal.emoji}</Text>
              <Text
                style={{
                  marginLeft: 4,
                  color: COLORS.ink900,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {feedCount} {feedCount === 1 ? 'vez' : 'veces'} hoy
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <ClockIcon color={COLORS.ink700} size={12} />
              <Text
                style={{
                  marginLeft: 4,
                  color: COLORS.ink700,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {timeAgo(lastAt)}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: '#fff',
                fontSize: 26,
                fontWeight: '800',
                letterSpacing: 0.3,
              }}
            >
              {animal.label}
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: 13,
                marginTop: 2,
                fontWeight: '500',
              }}
            >
              {totalAmount} kg servidos en el día
            </Text>
            {scheduleTimes.length > 0 && (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: 11,
                    fontWeight: '700',
                    marginRight: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                  }}
                >
                  Auto:
                </Text>
                {scheduleTimes.map((t) => (
                  <Text
                    key={t}
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: '800',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                      marginRight: 4,
                      marginTop: 2,
                    }}
                  >
                    {t}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </LinearGradient>

        {/* Indicador "toca para alimentar" — esquina inferior derecha de la foto */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 14,
            bottom: 14,
            backgroundColor: justFed ? COLORS.brand600 : animal.accent,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 999,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {justFed ? (
            <CheckIcon color="#fff" size={14} />
          ) : (
            <PlusIcon color="#fff" size={14} />
          )}
          <Text
            style={{
              color: '#fff',
              fontWeight: '800',
              fontSize: 13,
              marginLeft: 6,
              letterSpacing: 0.4,
            }}
          >
            {justFed ? '¡Listo!' : 'Alimentar'}
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View className="flex-row items-center">
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: animal.color,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>{animal.emoji}</Text>
          </View>
          <View>
            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 14,
                fontWeight: '700',
              }}
            >
              Porción estándar
            </Text>
            <Text style={{ color: COLORS.ink500, fontSize: 12 }}>
              {animal.defaultAmount} kg por toma · toca la card
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={animal.accent} />
        ) : (
          <Text style={{ fontSize: 22, opacity: 0.5 }}>›</Text>
        )}
      </View>
    </Pressable>
  );
}

// Banner animado de exito (toast)
function Toast({ visible, message }) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: visible ? 0 : -120,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateY, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 90,
        left: 16,
        right: 16,
        opacity,
        transform: [{ translateY }],
        backgroundColor: COLORS.ink900,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
        zIndex: 999,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: COLORS.brand500,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <CheckIcon color={COLORS.ink900} size={18} />
      </View>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14, flex: 1 }}>
        {message}
      </Text>
    </Animated.View>
  );
}

export default function FeedScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [feedings, setFeedings] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [justFed, setJustFed] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimer = useRef(null);

  const load = async () => {
    try {
      setError(null);
      const [s, f, sch] = await Promise.all([
        api.getStats('day'),
        api.getFeedings(),
        api.getSchedules(),
      ]);
      setStats(s);
      setFeedings(f.items || []);
      const map = {};
      for (const a of ANIMALS) {
        const found = sch.schedules.find((x) => x.animal === a.id);
        map[a.id] = found || { animal: a.id, times: [], amount: a.defaultAmount };
      }
      setSchedules(map);
    } catch (e) {
      setError(e.message || 'No se pudo cargar la información');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const showToast = (message) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, message });
    toastTimer.current = setTimeout(
      () => setToast({ visible: false, message: '' }),
      2400
    );
  };

  // Alerta principal al tocar la card: ahora o definir horario
  const handleFeed = (animal) => {
    if (loading) return;
    Alert.alert(
      'Elegir horario para alimentar',
      `¿Cómo quieres registrar la comida de ${animal.label}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Dar ahora',
          onPress: () => feedNow(animal),
        },
        {
          text: 'Definir Horarios',
          onPress: () => navigation.navigate('Horarios'),
        },
      ],
      { cancelable: true }
    );
  };

  const feedNow = async (animal) => {
    try {
      setLoading(animal.id);
      const res = await api.feed(animal.id, animal.defaultAmount);
      setJustFed(animal.id);
      showToast(`¡${animal.label} servidos! ${res.amount} kg registrados`);
      await load();
      setTimeout(() => setJustFed(null), 2500);
    } catch (e) {
      Alert.alert(
        'No se pudo registrar',
        e.message || 'Intenta de nuevo en un momento'
      );
    } finally {
      setLoading(null);
    }
  };

  const totalAmount = stats?.animals?.reduce(
    (acc, a) => acc + (a.totalAmount || 0),
    0
  );
  const totalFeedings = stats?.animals?.reduce(
    (acc, a) => acc + (a.feedCount || 0),
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['top']}>
      <Toast visible={toast.visible} message={toast.message} />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header / saludo */}
        <View
          style={{
            marginBottom: 18,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View className="flex-1">
            <Text
              style={{
                color: COLORS.ink500,
                fontSize: 13,
                fontWeight: '500',
                textTransform: 'capitalize',
              }}
            >
              {todayLong()}
            </Text>
            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 28,
                fontWeight: '800',
                marginTop: 2,
              }}
            >
              {greeting()}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Horarios')}
            hitSlop={10}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#0f1a0c',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 3,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            })}
          >
            <GearIcon color={COLORS.ink700} size={20} />
          </Pressable>
        </View>

        {/* Hero resumen */}
        <LinearGradient
          colors={[COLORS.brand500, COLORS.brand600]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 26,
            padding: 20,
            marginBottom: 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <View className="flex-row items-center">
              <LeafIcon color={COLORS.ink900} size={14} />
              <Text
                style={{
                  marginLeft: 6,
                  color: COLORS.ink900,
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Hoy en la granja
              </Text>
            </View>
            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 32,
                fontWeight: '800',
                marginTop: 6,
              }}
            >
              {totalAmount ?? '—'}
              <Text style={{ fontSize: 16, fontWeight: '600' }}> kg</Text>
            </Text>
            <Text
              style={{ color: COLORS.ink900, fontSize: 13, opacity: 0.85 }}
            >
              {totalFeedings ?? 0} tomas registradas · {ANIMALS.length} grupos
            </Text>
          </View>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(15,26,12,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 30 }}>🌾</Text>
          </View>
        </LinearGradient>

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
                style={{ color: COLORS.danger, fontWeight: '700', fontSize: 13 }}
              >
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 17,
              fontWeight: '800',
            }}
          >
            Toca una card para alimentar
          </Text>
        </View>

        {ANIMALS.map((animal) => {
          const s = stats?.animals?.find((x) => x.animal === animal.id);
          const sched = schedules[animal.id];
          return (
            <AnimalCard
              key={animal.id}
              animal={animal}
              stats={s}
              schedule={sched}
              onFeed={() => handleFeed(animal)}
              loading={loading === animal.id}
              justFed={justFed === animal.id}
            />
          );
        })}

        {/* Historial reciente */}
        {feedings.length > 0 && (
          <View style={{ marginTop: 6 }}>
            <Text
              style={{
                color: COLORS.ink900,
                fontSize: 17,
                fontWeight: '800',
                marginBottom: 10,
              }}
            >
              Actividad reciente
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 22,
                paddingVertical: 6,
                paddingHorizontal: 4,
              }}
            >
              {feedings.slice(0, 6).map((f, idx) => {
                const animal = ANIMALS.find((a) => a.id === f.animal);
                return (
                  <View
                    key={f.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderTopWidth: idx === 0 ? 0 : 1,
                      borderTopColor: '#eef0e8',
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        backgroundColor: animal?.color || COLORS.brand50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{animal?.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text
                        style={{
                          color: COLORS.ink900,
                          fontWeight: '700',
                          fontSize: 14,
                        }}
                      >
                        {animal?.label || f.animal}
                      </Text>
                      <Text style={{ color: COLORS.ink500, fontSize: 12 }}>
                        {timeAgo(f.createdAt)} · {f.amount} kg
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: COLORS.brand700,
                        fontWeight: '800',
                        fontSize: 13,
                      }}
                    >
                      {new Date(f.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {feedings.length === 0 && !error && (
          <View
            style={{
              marginTop: 12,
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 18,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 26 }}>🐮</Text>
            <Text
              style={{
                color: COLORS.ink700,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              Aún no hay tomas hoy. Toca una card para empezar.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}