/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_API_URL: string;
  // 여기에 추가로 사용하시는 다른 VITE_ 변수들이 있다면 똑같이 정의해주세요.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}