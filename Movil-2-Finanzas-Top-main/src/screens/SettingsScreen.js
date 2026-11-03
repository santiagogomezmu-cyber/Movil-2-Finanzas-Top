import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseService";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importante para guardar preferencias
import colors from "../constants/colors";
import { useAuth } from "../../navigation/AuthContext";

const SettingsScreen = () => {
    const { darkMode, setDarkMode } = useAuth();
    // Estados para los switches
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const palette = darkMode
        ? { background: '#34445a', surface: '#455a74', text: '#f7faff', muted: '#d6e0ed', border: '#657991', iconBackground: '#526781' }
        : { background: colors.fondloClaro, surface: colors.iluminado, text: colors.oscuro, muted: colors.subtitilo, border: colors.suave, iconBackground: 'rgba(45, 10, 245, 0.1)' };

    // Cargar las preferencias guardadas al abrir la pantalla
    useEffect(() => {
        const cargarPreferencias = async () => {
            try {
                const notifOpt = await AsyncStorage.getItem('@notifications');
                if (notifOpt !== null) setNotificationsEnabled(JSON.parse(notifOpt));

                const locOpt = await AsyncStorage.getItem('@location');
                if (locOpt !== null) setLocationEnabled(JSON.parse(locOpt));
            } catch (error) {
                console.error("Error al cargar preferencias:", error);
            }
        };
        cargarPreferencias();
    }, []);

    // Funciones para alternar y guardar el estado de cada switch
    const toggleDarkMode = async (value) => {
        try {
            await setDarkMode(value);
        } catch (error) {
            Alert.alert("No se pudo cambiar el tema", "Inténtalo de nuevo.");
        }
    };

    const toggleNotifications = async (value) => {
        setNotificationsEnabled(value);
        try {
            await AsyncStorage.setItem('@notifications', JSON.stringify(value));
        } catch (error) {
            console.error("Error al guardar notificaciones:", error);
        }
    };

    const toggleLocation = async (value) => {
        setLocationEnabled(value);
        try {
            await AsyncStorage.setItem('@location', JSON.stringify(value));
        } catch (error) {
            console.error("Error al guardar ubicación:", error);
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que deseas salir de Finanzas Top?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, salir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                        } catch (error) {
                            Alert.alert("Error", "No se pudo cerrar sesión: " + error.message);
                        }
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon, title, type, value, onToggle, onPress, isDanger }) => {
        return (
            <TouchableOpacity 
                style={[styles.settingItem, { backgroundColor: palette.surface }]}
                onPress={onPress}
                disabled={type === 'switch'}
            >
                <View style={styles.settingItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: isDanger ? 'rgba(255, 77, 77, 0.1)' : palette.iconBackground }]}>
                        <Ionicons name={icon} size={22} color={isDanger ? colors.alerta : colors.principal} />
                    </View>
                    <Text style={[styles.settingTitle, { color: isDanger ? colors.alerta : palette.text }]}>
                        {title}
                    </Text>
                </View>

                {type === 'switch' ? (
                    <Switch
                        trackColor={{ false: palette.border, true: colors.variante3 }}
                        thumbColor={value ? colors.iluminado : colors.iluminado}
                        onValueChange={onToggle}
                        value={value}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={24} color={colors.subtitilo} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: palette.background }]} showsVerticalScrollIndicator={false}>
            <View style={[styles.header, { backgroundColor: palette.surface, borderBottomColor: palette.border }]}>
                <Text style={[styles.headerTitle, { color: palette.text }]}>Ajustes</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.muted }]}>Preferencias</Text>
                <View style={[styles.card, { backgroundColor: palette.surface }]}>
                    <SettingItem 
                        icon="notifications-outline" 
                        title="Notificaciones push" 
                        type="switch"
                        value={notificationsEnabled}
                        onToggle={toggleNotifications}
                    />
                    <View style={[styles.divider, { backgroundColor: palette.border }]} />
                    <SettingItem 
                        icon="moon-outline" 
                        title="Modo oscuro" 
                        type="switch"
                        value={darkMode}
                        onToggle={toggleDarkMode}
                    />
                    <View style={[styles.divider, { backgroundColor: palette.border }]} />
                    <SettingItem 
                        icon="location-outline" 
                        title="Servicios de ubicación" 
                        type="switch"
                        value={locationEnabled}
                        onToggle={toggleLocation}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: palette.muted }]}>Cuenta e Información</Text>
                <View style={[styles.card, { backgroundColor: palette.surface }]}>
                    <SettingItem 
                        icon="lock-closed-outline" 
                        title="Privacidad y Seguridad" 
                        type="arrow"
                        onPress={() => Alert.alert("Privacidad", "Tus datos están protegidos localmente con SQLite y en la nube.")}
                    />
                    <View style={[styles.divider, { backgroundColor: palette.border }]} />
                    <SettingItem 
                        icon="help-circle-outline" 
                        title="Centro de Ayuda" 
                        type="arrow"
                        onPress={() => Alert.alert("Ayuda", "Consulta el manual técnico y de usuario en el proyecto.")}
                    />
                    <View style={[styles.divider, { backgroundColor: palette.border }]} />
                    <SettingItem 
                        icon="information-circle-outline" 
                        title="Acerca de la app" 
                        type="arrow"
                        onPress={() => Alert.alert("Finanzas Top", "Versión 1.0.0\nDesarrollado en React Native / Expo.")}
                    />
                </View>
            </View>

            <View style={[styles.section, { marginBottom: 40 }]}>
                <View style={[styles.card, { backgroundColor: palette.surface }]}>
                    <SettingItem 
                        icon="log-out-outline"
                        title="Cerrar Sesión"
                        type="arrow"
                        onPress={handleLogout}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fondloClaro,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.iluminado,
        borderBottomWidth: 1,
        borderBottomColor: colors.suave,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.oscuro,
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.subtitilo,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: colors.iluminado,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(45, 10, 245, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    settingTitle: {
        fontSize: 16,
        color: colors.oscuro,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.delicado,
        marginLeft: 70,
    }
});

export default SettingsScreen;