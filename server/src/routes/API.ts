import * as Express from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";
import * as RequestPromise from '../RequestPromise';
import { getConfig } from "../Config";
import { ItemViewModel, AboutItemViewModel } from "../Models";
import * as Path from 'path';
import { PdfRepo } from '../ApiRepo';

export class APIRoute {
    router: Express.Router;
    pdfRepo: PdfRepo;

    constructor() {
        this.pdfRepo = new PdfRepo();
        this.pdfRepo.loadDataFromSiw()
            .then(() => console.log("Data recieved from SampleItemsWebsite API"))
            .catch(err => console.error("Error loading data from SampleItemsWebsite API: ", err));

        this.router = Express.Router();
        this.router.get('/pdf', this.pdf);
        this.router.get('/search', this.search);
        this.router.get('/aboutItem', this.getAboutItem);
    }

    pdf = (req: Express.Request, res: Express.Response) => {
        const ids = req.query.ids as string || '';
        const requestedIds = ids.split(',');

        if (requestedIds.length === 0) {
            res.sendStatus(400);
        }
    
        let idGroups = this.pdfRepo.getAssociatedItems(requestedIds);
        this.pdfRepo.loadViewData(idGroups)
            .then(itemViews => {
                const htmlString = HtmlRenderer.renderBody(itemViews, 'Mathematics', 'Grade 5');
                const title = 'Grade 5 Mathematics';
                res.type('application/pdf');
                PdfGenerator.generate(htmlString, title).pipe(res);
            })
            .catch(error => {
                console.error('/api/pdf: ', error);
                res.sendStatus(500);
            });
    }
    
    search = (req: Express.Request, res: Express.Response) => {
        this.pdfRepo.getItemData()
            .then(searchResult => {
                res.type('application/json');
                res.send(JSON.stringify(this.pdfRepo.itemData));
            })
            .catch(err => {
                console.error('/api/search/: ', err);
                res.sendStatus(500);
            });
    }

    getAboutItem = (req: Express.Request, res: Express.Response) => {
        const itemKey = Number(req.query.itemKey || 0) || 0;
        const bankKey = Number(req.query.bankKey || 0) || 0;

        this.pdfRepo.getAboutItem(itemKey, bankKey)
            .then(about => {
                if (about) {
                    res.type('application/json');
                    res.send(JSON.stringify(about));
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(err => {
                console.error(`/api/aboutItem for ${bankKey}-${itemKey}: `, err);
                res.sendStatus(500);
            });
    }
}
