import {error, redirect} from '@sveltejs/kit';
import muhammara from 'muhammara';
import {version} from '$app/environment';

export function GET({url}: { url: URL }) {
    const name = url.searchParams.get('name');
    if (!name) {
        throw error(400, 'Invalid name');
    }
    const Recipe = muhammara.Recipe;
    const pdfDoc = new Recipe("src/lib/pdfs/Completion.pdf", "static/output.pdf");
    const now = new Date();
    pdfDoc
        // edit 1st page
        .editPage(1)
        .text(name, 170, 250, {
            color: "#000000",
            size: 20
        })
        .text(version, 350, 328, {
            color: "#000000",
            size: 14
        })
        .text(now.getMonth() + "/" + now.getDay() + "/" + now.getFullYear(), 430, 328, {
            color: "#000000",
            size: 14
        })
        .text(Date.now().toString(), 692, 228, {
            color: "#000000",
            size: 20,
            opacity: 0.5,
            rotation: 90
        })
        .text("VeriNow!", 660, 210, {
            color: "#000000",
            size: 14
        })
        .text("VeriNow!", 660, 380, {
            color: "#000000",
            size: 14
        })
        .rectangle(660, 250, 50, 10, {
            color: "#000000",
            fill: "#000000",
        })
        .rectangle(660, 350, 50, 10, {
            color: "#000000",
            fill: "#000000",
        })
        .endPage()
        .endPDF();

    throw redirect(302, '/output.pdf');
}