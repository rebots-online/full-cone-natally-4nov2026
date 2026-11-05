/** Public fields deliberately configured in .env and projected by Vite. */
declare const __APP_IDENTITY__: Readonly<{ name: string; identifier: string }>;

if (typeof __APP_IDENTITY__ === 'undefined' || !__APP_IDENTITY__.name || !__APP_IDENTITY__.identifier) {
  throw new Error('Required application identity is missing. Configure APP_NAME and APP_IDENTIFIER in .env.');
}

export const APP_NAME = __APP_IDENTITY__.name;
export const APP_IDENTIFIER = __APP_IDENTITY__.identifier;
