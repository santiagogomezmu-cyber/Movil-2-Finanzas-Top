import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { auth, signOut } from "../services/firebaseService";
import { selectAndUploadImage } from "../services/cloudinaryService";
import { updateUserProfilePhoto } from "../services/userService";

const UserScreen = () => {
    // Current user data from Firebase, or defaults if not available
    const user = auth.currentUser;
    const userName = user?.displayName || "Usuario Prueba";
    const userEmail = user?.email || "usuario@ejemplo.com";

    const [profileImage, setProfileImage] = useState(user?.photoURL || null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpdatePhoto = async () => {
        if (!user) {
            Alert.alert("Error", "Debes iniciar sesión para actualizar tu foto.");
            return;
        }

        try {
            setIsUploading(true);
            const imageUrl = await selectAndUploadImage();

            if (imageUrl) {
                await updateUserProfilePhoto(user.uid, imageUrl);
                setProfileImage(imageUrl);
                Alert.alert("Éxito", "Foto de perfil actualizada correctamente.");
            }
        } catch (error) {
            console.error("Error al actualizar la foto:", error);
            Alert.alert("Error", "No se pudo actualizar la foto de perfil.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={colors.gradienteSecundario} style={styles.headerBackground}>
                <TouchableOpacity onPress={handleUpdatePhoto} disabled={isUploading}>
                    <View style={styles.profileImageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="person" size={60} color={colors.suave} />
                        )}
                        {isUploading && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color={colors.iluminado} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={24} color={colors.variante2} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Nombre Completo</Text>
                            <Text style={styles.infoValue}>{userName}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={24} color={colors.variante2} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Correo Electrónico</Text>
                            <Text style={styles.infoValue}>{userEmail}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={colors.iluminado} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.fondloClaro,
    },
    headerBackground: {
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: colors.iluminado,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.iluminado,
    },
    userEmail: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    content: {
        padding: 20,
        marginTop: -30,
    },
    infoCard: {
        backgroundColor: colors.iluminado,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.oscuro,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    infoTextContainer: {
        marginLeft: 15,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.subtitilo,
    },
    infoValue: {
        fontSize: 16,
        color: colors.oscuro,
        fontWeight: '500',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.suave,
        marginVertical: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: colors.alerta,
        paddingVertical: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: colors.alerta,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    logoutText: {
        color: colors.iluminado,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default UserScreen;
