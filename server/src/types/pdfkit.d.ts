declare module "pdfkit" {
  import { EventEmitter } from "events";
  interface PDFDocumentOptions {
    margin?: number;
    size?: string;
    [key: string]: any;
  }
  class PDFDocument extends EventEmitter {
    constructor(options?: PDFDocumentOptions);
    font(font: string): this;
    fontSize(size: number): this;
    fillColor(color: string): this;
    text(text: string, x?: number, y?: number, options?: { width?: number; align?: string; [key: string]: any }): this;
    moveDown(lines?: number): this;
    addPage(): this;
    end(): void;
  }
  export default PDFDocument;
}
