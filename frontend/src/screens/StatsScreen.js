import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import PieChart from '../components/PieChart';
import { api } from '../api/client';
import { COLORS } from '../constants/colors';
import { ANIMALS } from '../constants/animals';

const PERIODS = [
  { id: 'day', label: 'Hoy' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mes' },
];

function formatToday() {
  const d = new Date();
  return d.toLocaleDateString('es-EC', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

export default function StatsScreen() {
  const [period, setPeriod] = useState('day');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.getStats(period);
      setStats(data);
    } catch (e) {
      setError(e.message || 'No se pudo cargar las estadisticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  // Refresco automatico cada vez que la pantalla gana foco (al volver de Alimentar)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

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
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header
          title="Estadísticas"
          subtitle={formatToday().replace(/^./, (c) => c.toUpperCase())}
        />

        {/* Selector de periodo */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#eef0e8',
            padding: 4,
            borderRadius: 999,
            marginBottom: 18,
          }}
        >
          {PERIODS.map((p) => {
            const active = p.id === period;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPeriod(p.id)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 999,
                  backgroundColor: active ? COLORS.brand500 : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: active ? COLORS.ink900 : COLORS.ink500,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Resumen */}
        <View
          style={{
            backgroundColor: COLORS.brand500,
            borderRadius: 24,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Resumen del periodo
          </Text>
          <View className="flex-row justify-between mt-3">
            <View>
              <Text
                style={{
                  color: COLORS.ink900,
                  fontSize: 26,
                  fontWeight: '800',
                }}
              >
                {totalAmount ?? '—'}
                <Text style={{ fontSize: 14, fontWeight: '600' }}> kg</Text>
              </Text>
              <Text
                style={{ color: COLORS.ink900, fontSize: 12, opacity: 0.8 }}
              >
                Comida total servida
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: COLORS.ink900,
                  fontSize: 26,
                  fontWeight: '800',
                  textAlign: 'right',
                }}
              >
                {totalFeedings ?? '—'}
              </Text>
              <Text
                style={{
                  color: COLORS.ink900,
                  fontSize: 12,
                  opacity: 0.8,
                  textAlign: 'right',
                }}
              >
                Veces alimentado
              </Text>
            </View>
          </View>
        </View>

        {/* Grafica de pastel - distribucion por animal */}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 24,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              color: COLORS.ink900,
              fontSize: 16,
              fontWeight: '800',
              marginBottom: 4,
            }}
          >
            Distribución por animal
          </Text>
          <Text
            style={{
              color: COLORS.ink500,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            Comida servida en el periodo
          </Text>

          {(() => {
            // Construye data para el PieChart desde stats
            const chartData = ANIMALS.map((animal) => {
              const s = stats?.animals?.find((x) => x.animal === animal.id);
              return {
                label: animal.label,
                value: s?.totalAmount || 0,
                color: animal.accent,
              };
            });
            const total = chartData.reduce((acc, d) => acc + d.value, 0);

            return (
              <View className="flex-row items-center">
                <View style={{ width: 160, height: 160 }}>
                  <PieChart
                    data={chartData}
                    size={160}
                    totalLabel="Total"
                    totalUnit="kg"
                  />
                </View>

                <View className="flex-1 ml-2">
                  {chartData.map((d, i) => {
                    const pct =
                      total > 0 ? Math.round((d.value / total) * 100) : 0;
                    return (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 4,
                            backgroundColor: d.color,
                            marginRight: 8,
                          }}
                        />
                        <Text
                          style={{
                            color: COLORS.ink900,
                            fontSize: 13,
                            fontWeight: '600',
                            flex: 1,
                          }}
                        >
                          {d.label}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.ink500,
                            fontSize: 12,
                            fontWeight: '700',
                          }}
                        >
                          {Math.round(d.value * 10) / 10} kg · {pct}%
                        </Text>
                      </View>
                    );
                  })}
                  {total === 0 && (
                    <Text
                      style={{
                        color: COLORS.ink500,
                        fontSize: 12,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: 10,
                      }}
                    >
                      Aún no hay datos en este periodo.
                    </Text>
                  )}
                </View>
              </View>
            );
          })()}
        </View>

        {error && (
          <View
            style={{
              backgroundColor: '#fde4e4',
              padding: 12,
              borderRadius: 12,
              marginBottom: 14,
            }}
          >
            <Text style={{ color: COLORS.danger, fontSize: 13 }}>
              {error}
            </Text>
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

        {loading && !stats ? (
          <View
            style={{ paddingVertical: 40, alignItems: 'center' }}
          >
            <ActivityIndicator color={COLORS.brand600} />
            <Text style={{ marginTop: 10, color: COLORS.ink500 }}>
              Cargando estadísticas…
            </Text>
          </View>
        ) : (
          ANIMALS.map((animal) => {
            const a = stats?.animals?.find((s) => s.animal === animal.id);
            if (!a) return null;
            return <StatCard key={animal.id} data={a} />;
          })
        )}

        <Text
          style={{
            color: COLORS.ink500,
            fontSize: 12,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Desliza hacia abajo para actualizar.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
