declare global {
  interface Document {
    startViewTransition: (callback: () => void) => void;
  }
  interface Window {
    Document: Document;
  }
}

export {};
