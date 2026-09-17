import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseService";

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            Alert.alert('🚀 ¡De Vuelta!', '¡Qué bueno verte por aquí otra vez!', [
                {
                    text: '¡A darle!', onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                }
            ]);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);

            let errorMessage = 'Error al iniciar sesión';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este correo electrónico';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }

            setError(errorMessage);
        }
    };

    const renderBackgroundEmojis = () => {
        return (
            <View style={styles.emojiBackgroundContainer} pointerEvents="none">
                <Text style={[styles.backgroundEmoji, { top: height * 0.05, left: width * 0.05, transform: [{ rotate: '-15deg' }] }]}>💸</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.25, left: width * 0.75, transform: [{ rotate: '20deg' }] }]}>💰</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.5, left: width * 0.1, transform: [{ rotate: '10deg' }], fontSize: 100 }]}>🤑</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.7, left: width * 0.65, transform: [{ rotate: '-25deg' }] }]}>💵</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.85, left: width * 0.2, transform: [{ rotate: '5deg' }] }]}>🪙</Text>
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            {renderBackgroundEmojis()}

            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.headerIconWrap}>
                        <Ionicons name="wallet" size={50} color="#11998e" />
                    </View>
                    <Text style={styles.title}>Iniciar Sesión</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#11998e" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#11998e" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.btnWrapper} onPress={handleLogin}>
                        <LinearGradient colors={['#1a2a6c', '#11998e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.loginButton}>
                            <Text style={styles.buttonText}>Entrar a mi Cuenta</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                        <Text style={styles.linkText}>¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text></Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f4f6f9',
    },
    emojiBackgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    backgroundEmoji: {
        position: 'absolute',
        fontSize: 70,
        opacity: 0.15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,1)',
    },
    headerIconWrap: {
        width: 90,
        height: 90,
        backgroundColor: 'rgba(17, 153, 142, 0.1)',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2c3e50',
        marginBottom: 30,
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 18,
        color: '#2c3e50',
        fontSize: 16,
        fontWeight: '600',
    },
    btnWrapper: {
        width: '100%',
        marginTop: 20,
        marginBottom: 15,
    },
    loginButton: {
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#11998e",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    linkContainer: {
        marginTop: 10,
        padding: 5,
    },
    linkText: {
        color: '#7f8c8d',
        fontSize: 15,
        fontWeight: '500',
    },
    linkBold: {
        color: '#11998e',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff5e62',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default LoginScreen;