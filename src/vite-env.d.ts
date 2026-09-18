/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EV_API_BASE_URL: string;
  readonly VITE_EV_SIMULATOR_ID: string;
  readonly VITE_EV_SIMULATOR_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
