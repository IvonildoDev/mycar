import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CadastroManutencao from './CadastroManutencao';
import ListaManutencoes from './ListaManutencoes';
import ControleGastos from './ControleGastos';
import CadastroVeiculo from './CadastroVeiculo';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f6fa',
  },
};

function CustomTabBarIcon({ name, color, size, focused }) {
  return (
    <Icon
      name={name}
      color={focused ? '#1976d2' : color}
      size={focused ? size + 8 : size}
      style={{ marginTop: 8 }}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="ListaManutencoes"
          screenOptions={({ route }) => ({
            headerStyle: {
              backgroundColor: '#1976d2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 22,
            },
            tabBarActiveTintColor: '#1976d2',
            tabBarInactiveTintColor: '#888',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 65,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 45,
              elevation: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              paddingBottom: 10,
            },
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;
              if (route.name === 'CadastroManutencao') iconName = 'add-circle-outline';
              else if (route.name === 'ListaManutencoes') iconName = 'list';
              else if (route.name === 'ControleGastos') iconName = 'attach-money';
              else if (route.name === 'CadastroVeiculo') iconName = 'directions-car';
              return (
                <CustomTabBarIcon
                  name={iconName}
                  color={color}
                  size={size}
                  focused={focused}
                />
              );
            },
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontSize: 14,
              margin: 0,
              padding: 0,
            },
          })}
        >
          <Tab.Screen
            name="CadastroManutencao"
            component={CadastroManutencao}
            options={{ tabBarLabel: 'Cadastro', headerTitle: 'Nova Manutenção' }}
          />
          <Tab.Screen
            name="ListaManutencoes"
            component={ListaManutencoes}
            options={{ tabBarLabel: 'Manutenções', headerTitle: 'Minhas Manutenções' }}
          />
          <Tab.Screen
            name="ControleGastos"
            component={ControleGastos}
            options={{ tabBarLabel: 'Gastos', headerTitle: 'Controle de Gastos' }}
          />
          <Tab.Screen
            name="CadastroVeiculo"
            component={CadastroVeiculo}
            options={{ tabBarLabel: 'Veículo', headerTitle: 'Cadastro de Veículo' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
