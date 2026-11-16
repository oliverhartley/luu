export type AppEnvironment = 'production' | 'test';

/**
 * Determina el entorno actual de la aplicación de manera inteligente:
 * 1. Override manual en localStorage (para pruebas dinámicas de admin).
 * 2. Variable VITE_APP_ENV compilada por Vite (.env.production / .env.test).
 * 3. Detección automática por URL/Hostname (localhost, preview channels de Firebase con '--test').
 */
export function getAppEnvironment(): AppEnvironment {
  // 1. Verificación de override manual si existiera en el navegador
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('luu_env_override');
    if (override === 'test' || override === 'production') {
      return override;
    }
  }

  // 2. Detección por Hostname (Cloud Run test service, test domain, localhost, preview)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === 'test.luu.cl' ||
      host.includes('luu-test-harliz') ||
      host.includes('luu-cl-test') ||
      host.includes('luu-test') ||
      host.includes('--test') ||
      host.startsWith('test.') ||
      host.includes('preview')
    ) {
      return 'test';
    }
  }

  // 3. Variable de entorno configurada en el build
  const envVar = import.meta.env.VITE_APP_ENV;
  if (envVar === 'production') return 'production';
  if (envVar === 'test') return 'test';

  return 'production';
}

/**
 * Indica si la aplicación está corriendo en ambiente TEST
 */
export function isTestEnv(): boolean {
  return getAppEnvironment() === 'test';
}

/**
 * Devuelve el nombre de la colección en Cloud Firestore.
 * En ambiente TEST añade el prefijo 'test_' para aislar al 100%
 * los datos y operaciones respecto al ambiente de Producción de Francisca.
 */
export function getCollectionName(baseName: string): string {
  return isTestEnv() ? `test_${baseName}` : baseName;
}

/**
 * Permite a un administrador alternar manualmente el entorno si lo requiere
 */
export function setEnvOverride(env: AppEnvironment | null): void {
  if (typeof window === 'undefined') return;
  if (env) {
    localStorage.setItem('luu_env_override', env);
  } else {
    localStorage.removeItem('luu_env_override');
  }
  window.location.reload();
}
