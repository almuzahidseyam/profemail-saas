import { MAX_TEXT } from "./resume-review";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export type ParsedResume = { text: string; pages?: number; warning?: string };
export function validateDocxZip(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  let end = -1;
  for (
    let i = buffer.byteLength - 22;
    i >= Math.max(0, buffer.byteLength - 65557);
    i--
  ) {
    if (
      view.getUint32(i, true) === 0x06054b50 &&
      i + 22 + view.getUint16(i + 20, true) === buffer.byteLength
    ) {
      end = i;
      break;
    }
  }
  if (end < 0) throw new Error("This is not a valid DOCX archive.");
  const count = view.getUint16(end + 10, true);
  const start = view.getUint32(end + 16, true);
  if (
    !count ||
    count > 1000 ||
    view.getUint16(end + 4, true) ||
    view.getUint16(end + 6, true)
  )
    throw new Error("This DOCX archive is unsupported or too complex.");
  let at = start,
    total = 0;
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    if (at + 46 > end || view.getUint32(at, true) !== 0x02014b50)
      throw new Error("Invalid DOCX directory.");
    const size = view.getUint32(at + 24, true);
    const nameLength = view.getUint16(at + 28, true);
    if (view.getUint16(at + 8, true) & 1)
      throw new Error("Password-protected DOCX files are not supported.");
    total += size;
    if (total > 20 * 1024 * 1024)
      throw new Error(
        "The expanded DOCX is too large. Use plain text instead.",
      );
    const next =
      at +
      46 +
      nameLength +
      view.getUint16(at + 30, true) +
      view.getUint16(at + 32, true);
    if (next > end) throw new Error("Invalid DOCX directory length.");
    names.push(
      new TextDecoder().decode(buffer.slice(at + 46, at + 46 + nameLength)),
    );
    at = next;
  }
  if (
    !names.includes("word/document.xml") ||
    !names.includes("[Content_Types].xml")
  )
    throw new Error("The archive is not a Word DOCX document.");
}
export async function readResume(file: File): Promise<ParsedResume> {
  if (!file.size || file.size > MAX_FILE_BYTES)
    throw new Error("Choose a non-empty file up to 5 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "docx", "txt"].includes(extension || ""))
    throw new Error(
      "Use a PDF, DOCX or TXT file. Legacy DOC files are not supported.",
    );
  const buffer = await file.arrayBuffer();
  let result: ParsedResume;
  if (extension === "pdf") {
    if (new TextDecoder().decode(buffer.slice(0, 5)) !== "%PDF-")
      throw new Error("This file does not have a valid PDF header.");
    const pdfjs = await import("pdfjs-dist");
    // Same-origin worker copied from the installed pdfjs version before dev/build.
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const task = pdfjs.getDocument({ data: buffer, useWorkerFetch: false });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 30) throw new Error("Use a CV with at most 30 pages.");
      const chunks: string[] = [];
      let length = 0;
      let empty = 0;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) =>
            "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "",
          )
          .join("");
        if (text.trim().length < 30) empty++;
        chunks.push(text);
        length += text.length;
        if (length > MAX_TEXT)
          throw new Error(
            "This document has too much text. Use at most 100,000 characters.",
          );
        page.cleanup();
      }
      result = {
        text: chunks.join("\n\n"),
        pages: pdf.numPages,
        warning: empty
          ? `${empty} page(s) have little or no extractable text. Scanned pages need OCR; check for missing content.`
          : "Check reading order below, especially for multi-column PDFs. Text extraction cannot certify the visual layout.",
      };
    } finally {
      await task.destroy();
    }
  } else if (extension === "docx") {
    validateDocxZip(buffer);
    const mammoth = await import("mammoth/mammoth.browser");
    // Raw text only: never inject converted document HTML into the page.
    const value = await mammoth.extractRawText({ arrayBuffer: buffer });
    result = {
      text: value.value,
      warning:
        "DOCX text extracted locally. Headers, footers, images and text boxes may not preserve their visual order; review the preview.",
    };
  } else {
    result = { text: new TextDecoder("utf-8", { fatal: true }).decode(buffer) };
  }
  if (result.text.length > MAX_TEXT)
    throw new Error("Use at most 100,000 characters.");
  if (result.text.trim().split(/\s+/).length < 30)
    throw new Error(
      "Not enough readable text. Use a text-based document, paste your CV, or run OCR on a scanned copy first.",
    );
  return result;
}
