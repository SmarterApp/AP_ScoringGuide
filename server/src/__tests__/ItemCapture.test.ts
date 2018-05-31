import * as Mocks from "./Mocks";
import { ItemCapture } from "../ItemCapture";
import { PdfViewType } from "@osu-cass/sb-components";
import * as Puppeteer from "puppeteer";

describe("ItemCapture.getIdString", () => {
    it("gets single id", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString(Mocks.itemGroupModel4569);
        expect(result).toEqual("123-4569");
    });

    it("no image ids", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString(Mocks.itemGroupModel4567);
        expect(result).toEqual("");
    });

    it("passage only", () => {
        const itemCapture = new ItemCapture();
        const result = itemCapture.getIdString({
            passage: {
                id: "182-1234",
                captured: false,
                type: PdfViewType.picture
            },
            questions: []
        });
        expect(result).toEqual("182-1234");
    });
});

describe("ItemCapture.setViewportHeight", async () => {
    const browser = await Puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(
        "http://ivs.smarterbalanced.org/items?ids=187-2558&isaap=TDS_SLM1"
    );
    const iframe = await page.frames()[1];

    it("sets the correct width", async () => {
        await ItemCapture.updateViewportSize(page, iframe, 800);
        const width = await page.evaluate(() => window.outerWidth);
        expect(width).toEqual(800);
    });

    it("viewport contains grouping", async () => {
        await ItemCapture.updateViewportSize(page, iframe, 800);
        const groupingHeight: number = await iframe.evaluate(() => {
            return document.querySelector(".grouping").clientHeight;
        });
        const windowHeight: number = await page.evaluate(
            () => window.outerHeight
        );
        expect(windowHeight).toBeGreaterThan(groupingHeight);
    });
});

describe("ItemCapture.getPassageRect", async () => {
    const browser = await Puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(
        "http://ivs.smarterbalanced.org/items?ids=187-2558&isaap=TDS_SLM1"
    );
    const iframe = await page.frames()[1];
    await iframe.waitForSelector(".grouping", {
        timeout: 5000
    });
    await new Promise(resolve => setTimeout(resolve, 200));

    it("gets the passage size", async () => {
        // TODO: why isnt this running
        const result = await ItemCapture.getPassageRect(iframe);
        expect(result).toEqual({
            x: 0,
            y: 123,
            height: 0,
            width: 0
        });
    });
});
