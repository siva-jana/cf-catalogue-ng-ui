declare module 'pdfjs-dist/build/pdf';
declare module 'pdfjs-dist/build/pdf.worker.entry';
declare module 'pdfjs-dist/legacy/build/pdf';
declare module 'pdfjs-dist/legacy/build/pdf.worker.entry';
declare module '*.worker.js' {
  const workerFactory: new () => Worker;
  export default workerFactory;
}
