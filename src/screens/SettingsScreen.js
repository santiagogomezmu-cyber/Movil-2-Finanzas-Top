import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const SettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(true);

    const SettingItem = ({ icon, title, type, value, onToggle, onPress, isDanger }) => {
        return (
            <TouchableOpacity 
                style={styles.settingItem} 
                onPress={onPress}
                disabled={type === 'switch'}
            >
                <View style={styles.settingItemLeft}>
                    <View style={[styles.iconContainer, isDanger && { backgroundColor: 'rgba(255, 77, 77, 0.1)' }]}>
                        <Ionicons name={icon} size={22} color={isDanger ? colors.alerta : colors.principal} />
                    </View>
                    <Text style={[styles.settingTitle, isDanger && { color: colors.alerta }]}>
                        {title}
                    </Text>
                </View>

                {type === 'switch' ? (
                    <Switch
                        trackColor={{ false: colors.suave, true: colors.variante3 }}
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Ajustes</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferencias</Text>
                <View style={styles.card}>
                    <SettingItem 
                        icon="notifications-outline" 
                        title="Notificaciones push" 
                        type="switch"
                        value={notificationsEnabled}
                        onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                    <View style={styles.divider} />
                    <SettingItem 
                        icon="moon-outline" 
                        title="Modo oscuro" 
                        type="switch"
                        value={darkModeEnabled}
                        onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
                    />
                    <View style={styles.divider} />
                    <SettingItem 
                        icon="location-outline" 
                        title="Servicios de ubicación" 
                        type="switch"
                        value={locationEnabled}
                        onToggle={() => setLocationEnabled(!locationEnabled)}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cuenta e Información</Text>
                <View style={styles.card}>
                    <SettingItem 
                        icon="lock-closed-outline" 
                        title="Privacidad y Seguridad" 
                        type="arrow"
                        onPress={() => {}}
                    />
                    <View style={styles.divider} />
                    <SettingItem 
                        icon="help-circle-outline" 
                        title="Centro de Ayuda" 
                        type="arrow"
                        onPress={() => {}}
                    />
                    <View style={styles.divider} />
                    <SettingItem 
                        icon="information-circle-outline" 
                        title="Acerca de la app" 
                        type="arrow"
                        onPress={() => {}}
                    />
                </View>
            </View>

            <View style={[styles.section, { marginBottom: 40 }]}>
                <View style={styles.card}>
                    <SettingItem 
                        icon="trash-outline" 
                        title="Eliminar Cuenta" 
                        type="arrow"
                        isDanger={true}
                        onPress={() => {}}
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
        marginLeft: 70, // Align with text
    }
});

export default SettingsScreen;
