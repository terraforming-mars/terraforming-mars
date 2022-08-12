declare global {
  interface Window {
    translations: { [key: string]: string } | undefined;
  }
}
export {};
