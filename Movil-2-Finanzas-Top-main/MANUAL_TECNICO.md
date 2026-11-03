# Manual Técnico - Finanzas Top

Este documento proporciona una visión detallada de la arquitectura, tecnologías y estructura interna de la aplicación móvil "Finanzas Top".

## 1. Tecnologías Utilizadas

La aplicación está construida sobre las siguientes tecnologías y librerías clave:

*   **Framework Principal:** React Native
*   **Plataforma / Toolchain:** Expo SDK 58
*   **Navegación:** React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/stack`)
*   **Base de Datos Local (Offline):** Expo SQLite (`expo-sqlite`)
*   **Autenticación y Nube:** Firebase (`firebase`)
*   **Almacenamiento de Imágenes:** Cloudinary
*   **Selección de Imágenes:** Expo Image Picker (`expo-image-picker`)
*   **Estilos y UI:** `expo-linear-gradient`, `@expo/vector-icons`

## 2. Estructura del Proyecto

El código fuente principal se encuentra en la carpeta `/src`, organizado de la siguiente manera:

*   `src/screens/`: Contiene las vistas principales de la aplicación.
    *   `HomeScreen.js`: Dashboard financiero, accesos rápidos e indicadores de presupuesto.
    *   `UserScreen.js`: Pantalla de perfil (cambio de foto y datos del usuario).
    *   `ContactScreen.js`: Accesos de demostración a WhatsApp, correo e Instagram.
    *   `SettingsScreen.js`: Pantalla de ajustes de la aplicación.
    *   `auth/`: Pantallas de inicio de sesión y registro.
*   `src/services/`: Capa de servicios y conexión a datos.
    *   `sqliteService.js`: Gestor de la base de datos local SQLite.
*   `src/components/`: Componentes reutilizables de UI.
*   `src/constants/`: Variables estáticas y constantes de la app.
*   `navigation/`: `AppNavigator.js` conecta el estado de Firebase, el tema persistente y las rutas de autenticación/pestañas; `AuthContext.js` comparte esos estados con las pantallas.

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
1.  **Inicialización:** `HomeScreen.js` llama a `sqliteService.init()` al cargar los datos y muestra un error con opción de reintento si falla.
2.  **Operaciones:** `HomeScreen.js` invoca operaciones asíncronas (`guardarSalario`, `agregarGasto`, `obtenerGastos`, `eliminarGasto`) que ejecutan sentencias SQL (`runAsync`, `getAllAsync`, `getFirstAsync`) sin bloquear la interfaz.
3.  **Autenticación:** `AppNavigator.js` observa los cambios de Firebase. Al iniciar o cerrar sesión, las rutas disponibles cambian automáticamente entre acceso/registro y el panel con pestañas.

## 4. Integración en la Nube (Cloudinary y Firebase)

*   **Perfil de Usuario:** Las imágenes subidas por el usuario se envían a Cloudinary a través de un *unsigned upload preset*. Esto devuelve una URL segura y optimizada. Para desarrollo local, configura `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` y `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` en el archivo `.env` de `Movil-2-Finanzas-Top-main`; los valores de ejemplo no permiten subir archivos. Crea el preset sin firma en Cloudinary y reinicia Expo con `npx expo start -c`. Para builds EAS, define ambas variables en el entorno EAS correspondiente.
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
