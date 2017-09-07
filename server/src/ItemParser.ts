import * as RequestPromise from './RequestPromise';
import * as Xml from 'xml2js';
import * as Cheerio from 'cheerio';
import { ItemGroup, ViewType } from "./Models";
import { getConfig } from './Config';

export class ItemParser {

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    load(items: string[]) {
        let postData = {
            items: items.map(i => {
                return { response: '', id: 'I-' + i }
            }),
            accommodations: [] as any[]
        }
        return RequestPromise.post(getConfig().api.itemViewerService + '/Pages/API/content/load', postData);
    }

    parseXml(xmlString: string) {
        return new Promise<any>((resolve, reject) => {
            Xml.parseString(xmlString, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });
    }

    parseHtml(xmlObject: any, itemIds: string[]) {
        let htmlString = xmlObject.contents.content[0].html[0] as string;
        let baseUrl = getConfig().api.itemViewerService;
        let $ = Cheerio.load(htmlString);
        $('a').remove();
        $('.questionNumber').remove();
        $('img').map((i, el) => {
            el.attribs['src'] = baseUrl + el.attribs['src'];
        });

        let itemData: ItemGroup = {
            questions: []
        };

        if ($('.thePassage').length) {
            const takePicture = this.shouldTakePicture($('.thePassage'))
            itemData.passage = {
                id: itemIds[0],
                type: takePicture ? ViewType.picture : ViewType.html,
                html: takePicture ? undefined : $('.thePassage').html(),
                captured: takePicture ? false : true
            }
        }

        itemIds.map(id => {
            const selector = '#Item_' + id.split('-').pop();
            const takePicture = this.shouldTakePicture($(selector));
            itemData.questions.push({
                id: id,
                view: {
                    id: id,
                    type: takePicture ? ViewType.picture : ViewType.html,
                    html: takePicture ? undefined : $(selector).html(),
                    captured: takePicture ? false : true
                } 
            });
        });

        return itemData;
    }

    shouldTakePicture(element: Cheerio) {
        let initializing = element.find('span').filter((i, el) => {
            if (el.children[0]) {
                return (el.children[0] as any).data === 'Initializing';
            }
            return false;
        }).length;
        return initializing !== 0;
    }

    /** Items should be related to each other (have the same passage) and be in the form BANK-ITEM (ex: 187-1437). */
    async loadItemData(items: string[]) {
        const response = await this.load(items);
        const xmlData = await this.parseXml(response);
        return this.parseHtml(xmlData, items);
    }

    async loadPlainHtml(item: string) {
        const response = await this.load([item]);
        const baseUrl = getConfig().api.itemViewerService;
        const xmlData = await this.parseXml(response);
        let htmlString = xmlData.contents.content[0].html[0] as string;
        let $ = Cheerio.load(htmlString);
        
        $('a').remove();
        $('img').map((i, el) => {
            el.attribs['src'] = baseUrl + el.attribs['src'];
        });
        return $.html();
    }
}

