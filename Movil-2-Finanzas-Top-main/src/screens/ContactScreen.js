import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../navigation/AuthContext";

const CONTACTS = [
    {
        key: "whatsapp",
        icon: "logo-whatsapp",
        label: "WhatsApp",
        value: "+1 (202) 555-0147",
        url: "https://wa.me/12025550147?text=Hola%2C%20necesito%20ayuda%20con%20Finanzas%20Top",
        color: "#159957",
        background: "#e3f7ed",
    },
    {
        key: "email",
        icon: "mail-outline",
        label: "Correo electrónico",
        value: "hola@finanzastop.example",
        url: "mailto:hola@finanzastop.example?subject=Ayuda%20Finanzas%20Top",
        color: "#5269c9",
        background: "#e9efff",
    },
    {
        key: "instagram",
        icon: "logo-instagram",
        label: "Instagram",
        value: "@finanzastop.demo.invalid",
        url: "https://www.instagram.com/finanzastop.demo.invalid/",
        color: "#c13584",
        background: "#fce8f1",
    },
];

const ContactScreen = () => {
    const { darkMode } = useAuth();
    const palette = darkMode
        ? { background: "#34445a", surface: "#455a74", text: "#f7faff", muted: "#d6e0ed", border: "#657991" }
        : { background: "#f4f6f9", surface: "#ffffff", text: "#2c3e50", muted: "#687782", border: "#e5e9ef" };

    const openContact = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error("No se pudo abrir el enlace de contacto:", error);
            Alert.alert("No se pudo abrir", "Revisa que tengas una aplicación compatible e inténtalo de nuevo.");
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
            <LinearGradient
                colors={darkMode ? ["#317f7a", "#3e7891"] : ["#1a2a6c", "#11998e"]}
                style={styles.header}
            >
                <View style={styles.headerIcon}>
                    <Ionicons name="chatbubbles-outline" size={30} color="#ffffff" />
                </View>
                <Text style={styles.title}>Estamos para ayudarte</Text>
                <Text style={styles.subtitle}>Elige cómo quieres ponerte en contacto con nosotros.</Text>
            </LinearGradient>

            <View style={[styles.card, { backgroundColor: palette.surface }]}>
                {CONTACTS.map((contact, index) => (
                    <React.Fragment key={contact.key}>
                        <TouchableOpacity style={styles.contactRow} onPress={() => openContact(contact.url)}>
                            <View style={[styles.contactIcon, { backgroundColor: contact.background }]}>
                                <Ionicons name={contact.icon} size={23} color={contact.color} />
                            </View>
                            <View style={styles.contactDetails}>
                                <Text style={[styles.contactLabel, { color: palette.text }]}>{contact.label}</Text>
                                <Text style={[styles.contactValue, { color: palette.muted }]}>{contact.value}</Text>
                            </View>
                            <Ionicons name="open-outline" size={20} color={palette.muted} />
                        </TouchableOpacity>
                        {index < CONTACTS.length - 1 ? (
                            <View style={[styles.divider, { backgroundColor: palette.border }]} />
                        ) : null}
                    </React.Fragment>
                ))}
            </View>

            <View style={[styles.notice, { backgroundColor: darkMode ? "#42516a" : "#fff7df" }]}>
                <Ionicons name="information-circle-outline" size={21} color={darkMode ? "#ffe08a" : "#a87500"} />
                <Text style={[styles.noticeText, { color: palette.text }]}>
                    Estos contactos son datos ficticios de demostración. Sustitúyelos por los canales oficiales antes de publicar la app.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingBottom: 28,
    },
    header: {
        paddingTop: 54,
        paddingBottom: 32,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerIcon: {
        width: 58,
        height: 58,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        marginBottom: 16,
    },
    title: {
        color: "#ffffff",
        fontSize: 26,
        fontWeight: "900",
    },
    subtitle: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
    },
    card: {
        marginHorizontal: 18,
        marginTop: 24,
        borderRadius: 20,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    contactRow: {
        minHeight: 78,
        flexDirection: "row",
        alignItems: "center",
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },
    contactDetails: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 15,
        fontWeight: "800",
    },
    contactValue: {
        fontSize: 13,
        marginTop: 4,
    },
    divider: {
        height: 1,
    },
    notice: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginHorizontal: 18,
        marginTop: 16,
        padding: 14,
        borderRadius: 15,
    },
    noticeText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        marginLeft: 9,
    },
});

export default ContactScreen;
