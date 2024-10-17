import { CanvasRenderingContext2D, createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

interface SeparatedText {
    line: string;
    remaining: string;
}

interface CreateOgpProps {
    dynamic: string;
    imageUrl: string;
    exportPlace: "blog" | "work";
    text: string;
    compressionOptions?: sharp.WebpOptions;
}

const MAX_WIDTH = 1000;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const FONT_SIZE = 60;
const LINE_HEIGHT = 80;

const createTextLine = (context: CanvasRenderingContext2D, text: string): SeparatedText => {
    for (let i = 0; i < text.length; i++) {
        const line = text.substring(0, i + 1);
        if (context.measureText(line).width > MAX_WIDTH) {
            return {
                line: text.substring(0, i),
                remaining: text.substring(i),
            };
        }
    }
    return { line: text, remaining: "" };
};

const createTextLines = (context: CanvasRenderingContext2D, text: string): string[] => {
    const lines: string[] = [];
    let currentText = text;

    while (currentText) {
        const { line, remaining } = createTextLine(context, currentText);
        lines.push(line);
        currentText = remaining;
    }

    return lines;
};

const drawText = (ctx: CanvasRenderingContext2D, lines: string[]): void => {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    lines.forEach((line, index) => {
        const y = CANVAS_HEIGHT / 2 + LINE_HEIGHT * (index - (lines.length - 1) / 2);
        ctx.strokeText(line, CANVAS_WIDTH / 2, y);
        ctx.fillText(line, CANVAS_WIDTH / 2, y);
    });

    ctx.restore();
};

const loadAndProcessImage = async (imageUrl: string): Promise<Buffer> => {
    try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const processedImage = await sharp(buffer)
            .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'cover' })
            .png()
            .toBuffer();

        return processedImage;
    } catch (error) {
        console.error("Error processing image:", error);
        throw new Error("Failed to process image");
    }
};

const createOgp = async ({
    dynamic,
    imageUrl,
    exportPlace,
    text,
    compressionOptions = { quality: 80 }
}: CreateOgpProps): Promise<void> => {
    try {
        const fontPath = path.resolve("./fonts/NotoSansJP-Regular.ttf");
        if (!(await fs.stat(fontPath).catch(() => false))) {
            throw new Error("Font file not found");
        }

        registerFont(fontPath, { family: "Noto Sans Japanese" });

        const backgroundBuffer = await loadAndProcessImage(imageUrl);

        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx = canvas.getContext("2d");

        const backgroundImage = await loadImage(backgroundBuffer);
        ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = `${FONT_SIZE}px "Noto Sans Japanese"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lines = createTextLines(ctx, text);
        drawText(ctx, lines);

        const buffer = canvas.toBuffer("image/png");

        const outputBuffer = await sharp(buffer)
            .webp(compressionOptions)
            .toBuffer();

        const outputPath = path.resolve(`./public/ogp/${exportPlace}/${dynamic}.webp`);
        await fs.writeFile(outputPath, outputBuffer);

        console.log(`OGP image created and saved as WebP: ${outputPath}`);
    } catch (error) {
        console.error("Error creating or saving OGP image:", error);
        throw error;
    }
};

export default createOgp;