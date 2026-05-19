import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, AuthContext } from './src/presentation/contexts/AuthContext';
import { TransactionProvider } from './src/presentation/contexts/TransactionContext';

import LoginScreen from './src/presentation/screens/LoginScreen';
import DashboardScreen from './src/presentation/screens/DashboardScreen';
import TransactionsScreen from './src/presentation/screens/TransactionsScreen';
import AddTransactionScreen from './src/presentation/screens/AddTransactionScreen';

import COLORS from './src/core/constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Dashboard: focused ? 'pie-chart' : 'pie-chart-outline',
            Extrato: focused ? 'list' : 'list-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Extrato" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}

function Routes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ headerShown: true, title: 'Nova Transação' }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <TransactionProvider>
          <Routes />
        </TransactionProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
