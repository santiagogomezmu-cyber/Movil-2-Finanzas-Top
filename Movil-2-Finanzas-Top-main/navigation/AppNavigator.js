import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext, useAuth } from './AuthContext';

import { auth } from '../src/services/firebaseService';

import RegisterScreen from '../src/screens/auth/RegisterScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import HomeScreen from '../src/screens/HomeScreen';
import UserScreen from '../src/screens/UserScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import ContactScreen from '../src/screens/ContactScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    const { user, darkMode } = useAuth();

    return(
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === "Contact") {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if(route.name === "Settings"){
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if(route.name === "User"){
                        if (user?.photoURL) {
                            return (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: focused ? 2 : 0,
                                        borderColor: focused ? '#0077B6' : 'transparent',
                                    }}
                                />
                            );
                        }
                        // Si no tiene foto, mostrar el icono por defecto
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: darkMode ? '#55d6be' : '#0077B6',
                tabBarInactiveTintColor: darkMode ? '#9aa8bd' : 'gray',
                tabBarStyle: {
                    backgroundColor: darkMode ? '#455a74' : '#ffffff',
                    borderTopColor: darkMode ? '#657991' : '#e5e7eb',
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel:'Home'}}/>
            <Tab.Screen name="User" component={UserScreen} options={{tabBarLabel:'Usuario'}}/>
            <Tab.Screen name="Contact" component={ContactScreen} options={{tabBarLabel:'Contactos'}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarLabel:'Ajustes'}}/>
        </Tab.Navigator>
    )
}   

const AppNavigator = () => {
    const [user, setUser] = useState(auth?.currentUser ?? null);
    const [darkMode, setDarkModeState] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@dark_mode');
                if (isMounted && savedTheme !== null) {
                    setDarkModeState(JSON.parse(savedTheme) === true);
                }
            } catch (error) {
                console.error('Error al cargar el tema:', error);
            }
        };

        loadTheme();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!auth) return undefined;

        return onAuthStateChanged(auth, setUser, (error) => {
            console.error('Error al comprobar la sesión:', error);
        });
    }, []);

    const setDarkMode = async (enabled) => {
        try {
            await AsyncStorage.setItem('@dark_mode', JSON.stringify(enabled));
            setDarkModeState(enabled);
        } catch (error) {
            console.error('Error al guardar el tema:', error);
            throw error;
        }
    };

    const authContextValue = {
        user,
        darkMode,
        setDarkMode,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            <StatusBar style={darkMode ? 'light' : 'dark'} />
            <Stack.Navigator initialRouteName={user ? 'Main' : 'Login'} screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={TabNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>   
    );
}

export default AppNavigator;