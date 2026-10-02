import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import sqliteService from "../services/sqliteService";

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const [salario, setSalario] = useState("");
    const [gastos, setGastos] = useState([]);
    const [nombreGasto, setNombreGasto] = useState("");
    const [montoGasto, setMontoGasto] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            const salarioGuardado = await sqliteService.obtenerSalario();
            if (salarioGuardado > 0) {
                setSalario(salarioGuardado.toString());
            }

            const gastosGuardados = await sqliteService.obtenerGastos();
            setGastos(gastosGuardados);
        };
        cargarDatos();
    }, []);

    const handleSalarioChange = async (text) => {
        setSalario(text);
        const monto = parseFloat(text) || 0;
        await sqliteService.guardarSalario(monto);
    };

    const agregarGasto = async () => {
        if (!nombreGasto || !montoGasto) return;
        
        const monto = parseFloat(montoGasto) || 0;
        const idGenerado = await sqliteService.agregarGasto(nombreGasto, monto);

        const nuevoGasto = {
            id: idGenerado,
            nombre: nombreGasto,
            monto: monto
        };

        setGastos([nuevoGasto, ...gastos]);
        setNombreGasto("");
        setMontoGasto("");
    };

    const eliminarGasto = async (id) => {
        await sqliteService.eliminarGasto(id);
        setGastos(gastos.filter(gasto => gasto.id !== id));
    };

    const salarioNum = parseFloat(salario) || 0;
    const totalGastos = gastos.reduce((acc, curr) => acc + curr.monto, 0);
    const presupuestoRestante = salarioNum - totalGastos;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { 
            style: 'currency', 
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const renderBackgroundEmojis = () => {
        return (
            <View style={styles.emojiBackgroundContainer} pointerEvents="none">
                <Text style={[styles.backgroundEmoji, { top: height * 0.05, left: width * 0.05, transform: [{ rotate: '-15deg'}] }]}>💸</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.25, left: width * 0.75, transform: [{ rotate: '20deg'}] }]}>💰</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.5, left: width * 0.1, transform: [{ rotate: '10deg'}], fontSize: 100 }]}>🤑</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.7, left: width * 0.65, transform: [{ rotate: '-25deg'}] }]}>💵</Text>
                <Text style={[styles.backgroundEmoji, { top: height * 0.85, left: width * 0.2, transform: [{ rotate: '5deg'}] }]}>🪙</Text>
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            {renderBackgroundEmojis()}
            
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <LinearGradient colors={['#1a2a6c', '#11998e', '#38ef7d']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>Finanzas Top 👋</Text>
                            <Text style={styles.subtitle}>Tu dinero, bajo control</Text>
                        </View>
                        <View style={styles.profileIcon}>
                            <Ionicons name="wallet-outline" size={28} color="#1a2a6c" />
                        </View>
                    </View>
                    
                    <View style={styles.balanceWrapper}>
                        <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(presupuestoRestante)}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>💰 Ingresos Mensuales</Text>
                    <View style={styles.glassCard}>
                        <View style={styles.inputRow}>
                            <Ionicons name="cash" size={28} color="#11998e" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 2000000"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                                keyboardType="numeric"
                                value={salario}
                                onChangeText={handleSalarioChange}
                            />
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <LinearGradient colors={['#dce35b', '#45b649']} style={styles.statCardGlass} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                            <View style={styles.iconContainerWhite}>
                                <Ionicons name="trending-up" size={24} color="#45b649" />
                            </View>
                            <Text style={styles.statLabelLight}>Ingresos</Text>
                            <Text style={styles.statValueLight} numberOfLines={1}>{formatCurrency(salarioNum)}</Text>
                        </LinearGradient>

                        <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.statCardGlass} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                            <View style={styles.iconContainerWhite}>
                                <Ionicons name="trending-down" size={24} color="#ff5e62" />
                            </View>
                            <Text style={styles.statLabelLight}>Gastos</Text>
                            <Text style={styles.statValueLight} numberOfLines={1}>{formatCurrency(totalGastos)}</Text>
                        </LinearGradient>
                    </View>

                    <Text style={styles.sectionTitle}>🛒 Registrar Gasto</Text>
                    <View style={[styles.glassCard, styles.addExpenseContainer]}>
                        <TextInput
                            style={[styles.inputClear, { flex: 1.5 }]}
                            placeholder="¿Qué compraste?"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            value={nombreGasto}
                            onChangeText={setNombreGasto}
                        />
                        <View style={styles.divider} />
                        <TextInput
                            style={[styles.inputClear, { flex: 1 }]}
                            placeholder="$$$"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            keyboardType="numeric"
                            value={montoGasto}
                            onChangeText={setMontoGasto}
                        />
                        <TouchableOpacity style={styles.actionBtn} onPress={agregarGasto}>
                            <Ionicons name="add-circle" size={44} color="#ff5e62" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>🧾 Historial de Gastos</Text>
                    {gastos.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={{fontSize: 40, marginBottom: 10}}>✨</Text>
                            <Text style={styles.emptyText}>¡Súper! Aún no tienes gastos.</Text>
                        </View>
                    ) : (
                        gastos.map((gasto) => (
                            <View key={gasto.id} style={styles.expenseItemGlass}>
                                <View style={styles.expenseIconWrap}>
                                    <Ionicons name="receipt" size={24} color="#ff5e62" />
                                </View>
                                <View style={styles.activityDetails}>
                                    <Text style={styles.activityTitle}>{gasto.nombre}</Text>
                                    <Text style={styles.expenseAmountText}>{formatCurrency(gasto.monto)}</Text>
                                </View>
                                <TouchableOpacity onPress={() => eliminarGasto(gasto.id)} style={styles.deleteBtn}>
                                    <Ionicons name="trash" size={22} color="#ff5e62" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
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
        opacity: 0.15, // baja opacidad para que no interrumpa el diseño
    },
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 65,
        paddingBottom: 35,
        paddingHorizontal: 25,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: "#11998e",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 30,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 5,
        fontWeight: '500',
    },
    profileIcon: {
        width: 55,
        height: 55,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    balanceWrapper: {
        marginTop: 35,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    balanceLabel: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: '800',
        letterSpacing: 2,
        opacity: 0.9,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: '900',
        color: '#ffffff',
        marginTop: 5,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 4,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 15,
        marginTop: 10,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 20,
        padding: 5,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,1)',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    inputClear: {
        height: 50,
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        paddingHorizontal: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCardGlass: {
        width: '48%',
        borderRadius: 25,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 6,
    },
    iconContainerWhite: {
        width: 45,
        height: 45,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    statLabelLight: {
        fontSize: 15,
        color: '#ffffff',
        fontWeight: '600',
        opacity: 0.9,
        marginBottom: 5,
    },
    statValueLight: {
        fontSize: 19,
        fontWeight: '900',
        color: '#ffffff',
    },
    addExpenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 10,
    },
    actionBtn: {
        marginLeft: 5,
    },
    expenseItemGlass: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,1)',
    },
    expenseIconWrap: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 94, 98, 0.15)',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    activityDetails: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 4,
    },
    expenseAmountText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#ff5e62',
    },
    deleteBtn: {
        padding: 10,
        backgroundColor: 'rgba(255, 94, 98, 0.1)',
        borderRadius: 12,
        marginLeft: 10,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 20,
        marginTop: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '600',
    }
});

export default HomeScreen;
