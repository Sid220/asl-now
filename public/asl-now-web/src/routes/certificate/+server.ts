import {error} from '@sveltejs/kit';
import PDFKit from 'pdfkit';
import * as fs from "fs";

export function GET() {
    const doc = new PDFKit();
    doc.pipe(fs.createWriteStream('/tmp/file.pdf'));

    doc.end();

    return new Response(String("hi"));
}