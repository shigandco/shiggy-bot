declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      SHIGGY_GUILD: string;
      PREFIX: string;
      ENABLE_HEALTHCHECK: string;
      SHARED_KEY?: string;
    }
  }
}

export {};
