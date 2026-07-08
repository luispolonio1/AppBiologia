import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import StatsScreen from './src/screens/StatsScreen';
import FeedScreen from './src/screens/FeedScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import { COLORS } from './src/constants/colors';
import { StatsIcon, FeedIcon } from './src/components/icons';

const Tab = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();

function TabBarLabel({ focused, label }) {
  return (
    <Text
      style={{
        color: focused ? COLORS.ink900 : COLORS.ink500,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  );
}

function FeedStackNav() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name="FeedHome" component={FeedScreen} />
      <FeedStack.Screen
        name="Horarios"
        component={ScheduleScreen}
        options={{ presentation: 'card' }}
      />
    </FeedStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: true,
            // Tab bar flotante: separado del borde inferior con margen y
            // esquinas redondeadas.
            tabBarStyle: {
              position: 'absolute',
              bottom:0,
              left: 18,
              right: 18,
              height: 100,
              borderRadius: 30,
              paddingTop:6,
              paddingBottom:6,
              backgroundColor: COLORS.white,
              borderTopWidth: 0,
              shadowColor: '#0f1a0c',
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 16,
              elevation: 8,
            },
            tabBarItemStyle: {
              paddingVertical: 0,
              borderRadius: 30,
            },
          }}
        >
          <Tab.Screen
            name="Estadísticas"
            component={StatsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <StatsIcon color={focused ? COLORS.brand600 : COLORS.ink500} />
              ),
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused} label="Estadísticas" />
              ),
            }}
          />
          <Tab.Screen
            name="Alimentar"
            component={FeedStackNav}
            options={{
              tabBarIcon: ({ focused }) => (
                <FeedIcon color={focused ? COLORS.brand600 : COLORS.ink500} />
              ),
              tabBarLabel: ({ focused }) => (
                <TabBarLabel focused={focused} label="Alimentar" />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}