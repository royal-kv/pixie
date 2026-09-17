/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION?: string;
  readonly VITE_AWS_BEDROCK_API_KEY?: string;
  readonly VITE_BEDROCK_MODEL_ID?: string;
  readonly VITE_USE_MOCK_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
