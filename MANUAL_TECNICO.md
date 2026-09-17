# Manual Técnico - Finanzas Top

Este documento proporciona una visión detallada de la arquitectura, tecnologías y estructura interna de la aplicación móvil "Finanzas Top".

## 1. Tecnologías Utilizadas

La aplicación está construida sobre las siguientes tecnologías y librerías clave:

*   **Framework Principal:** React Native
*   **Plataforma / Toolchain:** Expo SDK 54+
*   **Navegación:** React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`)
*   **Base de Datos Local (Offline):** Expo SQLite (`expo-sqlite`)
*   **Autenticación y Nube:** Firebase (`firebase`)
*   **Almacenamiento de Imágenes:** Cloudinary
*   **Selección de Imágenes:** Expo Image Picker (`expo-image-picker`)
*   **Estilos y UI:** `expo-linear-gradient`, `@expo/vector-icons`

## 2. Estructura del Proyecto

El código fuente principal se encuentra en la carpeta `/src`, organizado de la siguiente manera:

*   `src/screens/`: Contiene las vistas principales de la aplicación.
    *   `HomeScreen.js`: Pantalla del dashboard financiero (manejo de ingresos y gastos).
    *   `UserScreen.js`: Pantalla de perfil (cambio de foto y datos del usuario).
    *   `SettingsScreen.js`: Pantalla de ajustes de la aplicación.
    *   `SplashScreen.js`: Pantalla de carga inicial.
    *   `auth/`: Pantallas de inicio de sesión y registro.
*   `src/services/`: Capa de servicios y conexión a datos.
    *   `sqliteService.js`: Gestor de la base de datos local SQLite.
*   `src/components/`: Componentes reutilizables de UI.
*   `src/constants/`: Variables estáticas y constantes de la app.
*   `navigation/`: Contiene los archivos de configuración de rutas (`AppProvider.js`, etc.).

## 3. Arquitectura de Base de Datos Local (SQLite)

La persistencia de datos financieros y de configuración se maneja localmente mediante el archivo `miapp.db`.

### Tablas Implementadas

**Tabla: `configuracion`**
Guarda información global, como el salario mensual del usuario.
*   `id` (INTEGER PRIMARY KEY): Identificador único (se usa `id = 1` por defecto).
*   `salario` (REAL): Monto total de los ingresos mensuales.

**Tabla: `gastos`**
Mantiene el registro detallado de todas las salidas de dinero.
*   `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Identificador único del gasto.
*   `nombre` (TEXT NOT NULL): Concepto o descripción del gasto.
*   `monto` (REAL NOT NULL): Cantidad monetaria.

### Flujo de Datos (Data Flow)
1.  **Inicialización:** `AppProvider.js` llama a `sqliteService.init()` para asegurar que las tablas existan antes de renderizar la aplicación.
2.  **Operaciones:** `HomeScreen.js` invoca operaciones asíncronas (`guardarSalario`, `agregarGasto`, `obtenerGastos`, `eliminarGasto`) las cuales ejecutan sentencias SQL (`runAsync`, `getAllAsync`, `getFirstAsync`) sin bloquear la interfaz.

## 4. Integración en la Nube (Cloudinary y Firebase)

*   **Perfil de Usuario:** Las imágenes subidas por el usuario se envían a Cloudinary a través de un *unsigned upload preset*. Esto devuelve una URL segura y optimizada.
*   **Persistencia de Perfil:** La URL obtenida de Cloudinary se sincroniza directamente con el perfil del usuario autenticado en Firebase (Firestore o Auth), asegurando que la foto se mantenga a lo largo de las sesiones.

## 5. Instrucciones de Desarrollo

Para ejecutar el entorno de desarrollo localmente:

1.  Clonar el repositorio.
2.  Instalar las dependencias de Node:
    ```bash
    npm install
    ```
3.  Iniciar el servidor de Expo:
    ```bash
    npx expo start
    ```
4.  Utilizar Expo Go en un dispositivo móvil o presionar `a` para iniciar el emulador de Android o `i` para iOS.
