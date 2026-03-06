# Simulador AdabTech

## Descripción

Este es un simulador solar desarrollado con React, TypeScript y Vite. La aplicación permite simular y calcular presupuestos de sistemas solares de forma interactiva.

---

## Requisitos

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

- **Node.js** (versión 16 o superior)
- **npm** o **pnpm** (gestor de paquetes)
- **Git** (para clonar el repositorio)

Para verificar que tienes Node.js instalado, ejecuta en tu terminal:
```bash
node --version
npm --version
```

---

## Instrucciones de Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd adabtech_simulator
```

### 2. Instalar Dependencias

Ejecuta uno de los siguientes comandos según el gestor de paquetes que uses:

**Con npm:**
```bash
npm install
```

**Con pnpm:**
```bash
pnpm install
```

---

## Cómo Ejecutar el Proyecto

### Modo de Desarrollo

Para ejecutar el proyecto en modo desarrollo con recarga automática:

```bash
npm run dev
```

o con pnpm:

```bash
pnpm dev
```

Una vez ejecutado, abre tu navegador web en la dirección:
```
http://localhost:5173
```

### Construir para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

o con pnpm:

```bash
pnpm build
```

Los archivos compilados se generarán en la carpeta `dist/`.

---

## Estructura del Proyecto

```
src/
├── main.tsx              # Punto de entrada principal
├── app/
│   ├── App.tsx           # Componente raíz
│   ├── assets/           # Recursos estáticos
│   └── components/       # Componentes React
│       ├── SolarSimulator.tsx
│       ├── SolarQuotationModule.tsx
│       └── ...
└── styles/               # Estilos CSS y Tailwind
```

---

## Dependencias Principales

- **React**: Librería para construir interfaces de usuario
- **TypeScript**: Lenguaje tipado para JavaScript
- **Vite**: Herramienta de construcción y desarrollo rápida
- **Tailwind CSS**: Framework de utilidades para CSS
- **React Router**: Navegación en la aplicación
- **SweetAlert2**: Ventanas emergentes personalizadas

---

## Notas Adicionales

- El proyecto utiliza **Tailwind CSS** para los estilos
- Se incluye **TypeScript** para mayor seguridad de tipos
- La aplicación está configurada para funcionar como una página única (SPA)

Para más información, consulta el archivo `Guidelines.md` en la carpeta `guidelines/`.
