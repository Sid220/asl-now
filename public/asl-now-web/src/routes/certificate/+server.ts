import {error} from '@sveltejs/kit';
import muhammara, {createWriter, PDFStreamForResponse} from 'muhammara';
import {version} from '$app/environment';
import fs from "fs";
import https from "https";

export const config = {
    runtime: 'edge'
};

const PDF_FILE = "https://cdn.jsdelivr.net/gh/Sid220/cdn@main/asl-now/Completion.pdf";

function createCert(in_pdf: string, name: string): Promise<Response> {
    const Recipe = muhammara.Recipe;
    const pdfDoc = new Recipe(in_pdf, "/tmp/out.pdf");
    const now = new Date();
    return new Promise((resolve) => {
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
            .endPDF(() => {
                const pdfContent = fs.readFileSync("/tmp/out.pdf");
                resolve(new Response(pdfContent, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="certificate.pdf"'
                    }
                }));
            });
    });
}

export async function GET({url}: { url: URL }) {
    const name = url.searchParams.get('name');
    if (!name) {
        throw error(400, 'Invalid name');
    }

    let filePromise = () => new Promise((resolve) => {
        resolve(null);
    });
    if (!fs.existsSync("/tmp/blank.pdf")) {
        const file = fs.createWriteStream("/tmp/blank.pdf");
        filePromise = () => {
            return new Promise((resolve) => {
                https.get(PDF_FILE, function (response) {
                    response.pipe(file);

                    // after download completed close filestream
                    file.on("finish", () => {
                        file.close();
                        console.log("Download Completed");
                        resolve(null);
                    });
                });
            });
        }
    }
    await filePromise();
    return await createCert("/tmp/blank.pdf", name);
}