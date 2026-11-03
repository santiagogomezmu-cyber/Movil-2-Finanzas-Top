import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Importante para la navegación
import sqliteService from "../services/sqliteService";
import { useAuth } from "../../navigation/AuthContext";

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation(); // Hook de navegación
    const { darkMode, setDarkMode } = useAuth();
    const scrollViewRef = useRef(null);
    const expenseFormOffset = useRef(0);
    const [salario, setSalario] = useState("");
    const [gastos, setGastos] = useState([]);
    const [nombreGasto, setNombreGasto] = useState("");
    const [montoGasto, setMontoGasto] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [formError, setFormError] = useState("");
    const [tipIndex, setTipIndex] = useState(0);
    const palette = darkMode
        ? { background: '#34445a', surface: '#455a74', text: '#f7faff', muted: '#d6e0ed', border: '#657991', input: '#526781' }
        : { background: '#f4f6f9', surface: '#ffffff', text: '#2c3e50', muted: '#687782', border: '#e5e9ef', input: '#ffffff' };
    const financialTips = [
        "Separa primero una parte de tus ingresos para ahorrar; no esperes a ver qué sobra.",
        "Anota tus gastos pequeños: juntos pueden representar una parte importante del presupuesto.",
        "Antes de una compra grande, compara opciones y espera un día para decidir.",
        "Define un límite semanal para tus gastos variables y revísalo con frecuencia.",
    ];

    const cambiarTema = async () => {
        try {
            await setDarkMode(!darkMode);
        } catch (error) {
            Alert.alert("No se pudo cambiar el tema", "Inténtalo de nuevo.");
        }
    };

    const cargarDatos = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
            await sqliteService.init();
            const salarioGuardado = await sqliteService.obtenerSalario();
            const gastosGuardados = await sqliteService.obtenerGastos();
            setSalario(salarioGuardado > 0 ? salarioGuardado.toString() : "");
            setGastos(gastosGuardados);
        } catch (error) {
            console.error("Error al cargar los datos financieros:", error);
            setLoadError("No se pudieron cargar tus datos. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSalarioChange = (text) => {
        setSalario(text);
        setFormError("");
    };

    const guardarSalario = async () => {
        const monto = salario.trim() === "" ? 0 : Number(salario.replace(",", "."));
        if (!Number.isFinite(monto) || monto < 0) {
            setFormError("Ingresa un ingreso válido y mayor o igual a cero.");
            return;
        }

        try {
            await sqliteService.guardarSalario(monto);
            setFormError("");
        } catch (error) {
            console.error("Error al guardar el ingreso:", error);
            setFormError("No se pudo guardar el ingreso. Inténtalo de nuevo.");
        }
    };

    const agregarGasto = async () => {
        const nombre = nombreGasto.trim();
        const monto = Number(montoGasto.replace(",", "."));
        if (!nombre) {
            setFormError("Escribe el nombre del gasto.");
            return;
        }
        if (!Number.isFinite(monto) || monto <= 0) {
            setFormError("Ingresa un monto válido mayor que cero.");
            return;
        }

        setIsSaving(true);
        try {
            const idGenerado = await sqliteService.agregarGasto(nombre, monto);
            setGastos((actuales) => [{ id: idGenerado, nombre, monto }, ...actuales]);
            setNombreGasto("");
            setMontoGasto("");
            setFormError("");
        } catch (error) {
            console.error("Error al registrar el gasto:", error);
            Alert.alert("No se pudo guardar", "Revisa el almacenamiento e inténtalo de nuevo.");
        } finally {
            setIsSaving(false);
        }
    };

    const irARegistrarGasto = () => {
        scrollViewRef.current?.scrollTo({ y: expenseFormOffset.current, animated: true });
    };

    const eliminarGasto = async (id) => {
        try {
            await sqliteService.eliminarGasto(id);
            setGastos((actuales) => actuales.filter((gasto) => gasto.id !== id));
        } catch (error) {
            console.error("Error al eliminar el gasto:", error);
            Alert.alert("No se pudo eliminar", "Inténtalo de nuevo.");
        }
    };

    const salarioNum = Number(salario.replace(",", ".")) || 0;
    const totalGastos = gastos.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
    const presupuestoRestante = salarioNum - totalGastos;
    const porcentajeGastos = salarioNum > 0 ? (totalGastos / salarioNum) * 100 : 0;
    const porcentajeAhorro = salarioNum > 0 ? (presupuestoRestante / salarioNum) * 100 : 0;
    const gastoPromedio = gastos.length > 0 ? totalGastos / gastos.length : 0;
    const barraPresupuesto = Math.min(Math.max(porcentajeGastos, 0), 100);

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
        <View style={[styles.mainContainer, { backgroundColor: palette.background }]}>
            {renderBackgroundEmojis()}
            
            <ScrollView
                ref={scrollViewRef}
                style={[styles.container, { backgroundColor: palette.background }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <LinearGradient colors={['#1a2a6c', '#11998e', '#38ef7d']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>Finanzas Top 👋</Text>
                            <Text style={styles.subtitle}>Tu dinero, bajo control</Text>
                        </View>
                        {/* Botón funcional para ir a Ajustes */}
                        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings-outline" size={26} color="#1a2a6c" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.balanceWrapper}>
                        <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(presupuestoRestante)}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <Text style={[styles.sectionTitle, { color: palette.text }]}>Accesos rápidos</Text>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={irARegistrarGasto}>
                            <Ionicons name="add-circle-outline" size={23} color="#11998e" />
                            <Text style={[styles.quickActionText, { color: palette.text }]}>Nuevo gasto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={() => navigation.navigate('User')}>
                            <Ionicons name="person-circle-outline" size={23} color="#11998e" />
                            <Text style={[styles.quickActionText, { color: palette.text }]}>Mi perfil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings-outline" size={22} color="#11998e" />
                            <Text style={[styles.quickActionText, { color: palette.text }]}>Ajustes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.quickAction, { backgroundColor: palette.surface }]} onPress={cambiarTema}>
                            <Ionicons name={darkMode ? "sunny-outline" : "moon-outline"} size={22} color="#11998e" />
                            <Text style={[styles.quickActionText, { color: palette.text }]}>{darkMode ? "Modo claro" : "Modo oscuro"}</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color="#11998e" />
                            <Text style={[styles.loadingText, { color: palette.muted }]}>Cargando tus movimientos...</Text>
                        </View>
                    ) : null}
                    {loadError ? (
                        <View style={[styles.errorCard, { backgroundColor: darkMode ? '#3a2028' : '#fff0f0' }]}>
                            <Text style={styles.formError}>{loadError}</Text>
                            <TouchableOpacity onPress={cargarDatos}>
                                <Text style={styles.retryText}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <Text style={[styles.sectionTitle, { color: palette.text }]}>💰 Ingresos Mensuales</Text>
                    <View style={[styles.glassCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <View style={styles.inputRow}>
                            <Ionicons name="cash" size={28} color="#11998e" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: palette.text }]}
                                placeholder="Ej: 2000000"
                                placeholderTextColor={darkMode ? '#8b98aa' : 'rgba(0,0,0,0.4)'}
                                keyboardType="numeric"
                                value={salario}
                                onChangeText={handleSalarioChange}
                                onBlur={guardarSalario}
                            />
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <LinearGradient colors={darkMode ? ['#17463f', '#17635a'] : ['#dce35b', '#45b649']} style={styles.statCardGlass} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                            <View style={styles.iconContainerWhite}>
                                <Ionicons name="trending-up" size={24} color="#45b649" />
                            </View>
                            <Text style={styles.statLabelLight}>Ingresos</Text>
                            <Text style={styles.statValueLight} numberOfLines={1}>{formatCurrency(salarioNum)}</Text>
                        </LinearGradient>

                        <LinearGradient colors={darkMode ? ['#673b47', '#853d4c'] : ['#ff9966', '#ff5e62']} style={styles.statCardGlass} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                            <View style={styles.iconContainerWhite}>
                                <Ionicons name="trending-down" size={24} color="#ff5e62" />
                            </View>
                            <Text style={styles.statLabelLight}>Gastos</Text>
                            <Text style={styles.statValueLight} numberOfLines={1}>{formatCurrency(totalGastos)}</Text>
                        </LinearGradient>
                    </View>

                    <Text style={[styles.sectionTitle, { color: palette.text }]}>📊 Indicadores</Text>
                    <View style={styles.indicatorGrid}>
                        <View style={[styles.indicatorCard, { backgroundColor: palette.surface }]}>
                            <View style={styles.indicatorHeading}>
                                <Ionicons name="pie-chart-outline" size={20} color="#11998e" />
                                <Text style={[styles.indicatorLabel, { color: palette.muted }]}>Presupuesto usado</Text>
                            </View>
                            <Text style={[styles.indicatorValue, { color: palette.text }]}>
                                {salarioNum > 0 ? `${porcentajeGastos.toFixed(0)}%` : "Define tus ingresos"}
                            </Text>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: `${barraPresupuesto}%` }]} />
                            </View>
                        </View>
                        <View style={[styles.indicatorCard, { backgroundColor: palette.surface }]}>
                            <View style={styles.indicatorHeading}>
                                <Ionicons name="sparkles-outline" size={20} color="#11998e" />
                                <Text style={[styles.indicatorLabel, { color: palette.muted }]}>Tasa de ahorro</Text>
                            </View>
                            <Text style={[styles.indicatorValue, { color: palette.text }]}>
                                {salarioNum > 0 ? `${porcentajeAhorro.toFixed(0)}%` : "—"}
                            </Text>
                        </View>
                        <View style={[styles.indicatorCard, { backgroundColor: palette.surface }]}>
                            <View style={styles.indicatorHeading}>
                                <Ionicons name="receipt-outline" size={20} color="#11998e" />
                                <Text style={[styles.indicatorLabel, { color: palette.muted }]}>Gastos registrados</Text>
                            </View>
                            <Text style={[styles.indicatorValue, { color: palette.text }]}>{gastos.length}</Text>
                        </View>
                        <View style={[styles.indicatorCard, { backgroundColor: palette.surface }]}>
                            <View style={styles.indicatorHeading}>
                                <Ionicons name="calculator-outline" size={20} color="#11998e" />
                                <Text style={[styles.indicatorLabel, { color: palette.muted }]}>Gasto promedio</Text>
                            </View>
                            <Text style={[styles.indicatorValue, { color: palette.text }]} numberOfLines={1}>
                                {formatCurrency(gastoPromedio)}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.tipCard, { backgroundColor: darkMode ? '#152b35' : '#e8f7f3' }]}>
                        <View style={styles.tipHeader}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="bulb-outline" size={22} color="#11998e" />
                            </View>
                            <Text style={[styles.tipTitle, { color: palette.text }]}>Un consejo para ti</Text>
                        </View>
                        <Text style={[styles.tipText, { color: palette.muted }]}>{financialTips[tipIndex]}</Text>
                        <TouchableOpacity
                            style={styles.tipButton}
                            onPress={() => setTipIndex((current) => (current + 1) % financialTips.length)}
                        >
                            <Text style={styles.tipButtonText}>Otro consejo</Text>
                            <Ionicons name="arrow-forward" size={16} color="#11998e" />
                        </TouchableOpacity>
                    </View>

                    <View
                        onLayout={(event) => {
                            expenseFormOffset.current = event.nativeEvent.layout.y;
                        }}
                    >
                        <Text style={[styles.sectionTitle, { color: palette.text }]}>🛒 Registrar Gasto</Text>
                        <View style={[styles.glassCard, styles.addExpenseContainer, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <TextInput
                                style={[styles.inputClear, { flex: 1.5, color: palette.text }]}
                                placeholder="¿Qué compraste?"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                                value={nombreGasto}
                                onChangeText={(text) => {
                                    setNombreGasto(text);
                                    setFormError("");
                                }}
                            />
                            <View style={styles.divider} />
                            <TextInput
                                style={[styles.inputClear, { flex: 1, color: palette.text }]}
                                placeholder="$$$"
                                placeholderTextColor="rgba(0,0,0,0.4)"
                                keyboardType="numeric"
                                value={montoGasto}
                                onChangeText={(text) => {
                                    setMontoGasto(text);
                                    setFormError("");
                                }}
                            />
                            <TouchableOpacity style={styles.actionBtn} onPress={agregarGasto} disabled={isSaving}>
                                {isSaving ? (
                                    <ActivityIndicator size="large" color="#ff5e62" />
                                ) : (
                                    <Ionicons name="add-circle" size={44} color="#ff5e62" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {formError ? <Text style={styles.formError}>{formError}</Text> : null}
                    </View>

                    <Text style={[styles.sectionTitle, { color: palette.text }]}>🧾 Historial de Gastos</Text>
                    {gastos.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: palette.surface }]}>
                            <Text style={{fontSize: 40, marginBottom: 10}}>✨</Text>
                            <Text style={[styles.emptyText, { color: palette.muted }]}>¡Súper! Aún no tienes gastos.</Text>
                        </View>
                    ) : (
                        gastos.map((gasto) => (
                            <View key={gasto.id} style={[styles.expenseItemGlass, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                                <View style={styles.expenseIconWrap}>
                                    <Ionicons name="receipt" size={24} color="#ff5e62" />
                                </View>
                                <View style={styles.activityDetails}>
                                    <Text style={[styles.activityTitle, { color: palette.text }]}>{gasto.nombre}</Text>
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
        opacity: 0.15,
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
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    quickAction: {
        width: '48%',
        minHeight: 76,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    quickActionText: {
        marginTop: 4,
        color: '#2c3e50',
        fontSize: 12,
        fontWeight: '700',
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    loadingText: {
        marginLeft: 8,
        color: '#687782',
        fontSize: 13,
    },
    errorCard: {
        backgroundColor: '#fff0f0',
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
    },
    retryText: {
        color: '#0077B6',
        fontWeight: '800',
        marginTop: 8,
    },
    indicatorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    indicatorCard: {
        width: '48%',
        minHeight: 112,
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    indicatorHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    indicatorLabel: {
        flex: 1,
        marginLeft: 7,
        color: '#687782',
        fontSize: 12,
        fontWeight: '700',
    },
    indicatorValue: {
        color: '#2c3e50',
        fontSize: 19,
        fontWeight: '900',
    },
    progressTrack: {
        height: 7,
        marginTop: 10,
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: '#e5eeee',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#11998e',
    },
    formError: {
        color: '#c0392b',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
    },
    tipCard: {
        borderRadius: 20,
        padding: 18,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: 'rgba(17, 153, 142, 0.12)',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    tipIcon: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(17, 153, 142, 0.12)',
        borderRadius: 13,
        marginRight: 10,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    tipText: {
        fontSize: 14,
        lineHeight: 21,
    },
    tipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 12,
        paddingVertical: 6,
        paddingRight: 8,
    },
    tipButtonText: {
        color: '#11998e',
        fontSize: 14,
        fontWeight: '800',
        marginRight: 6,
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