import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ItemGroup } from './Models';
import { PdfComponent } from './components/PdfComponent';
import { Stream } from "stream";
import { getConfig } from "./Config";
const wkhtmltopdf = require('wkhtmltopdf');

export class HtmlRenderer {
    static renderBody(items: ItemGroup[], subject: string, grade: string) {
        const baseUrl = "http://localhost:" + getConfig().port;
        return ReactDOMServer.renderToString(
            <PdfComponent items={items} subject={subject} grade={grade} baseUrl={baseUrl} />
        );
    }
}

export class PdfGenerator {
    static generate(html: string, title: string) {
        const urlTitle = encodeURIComponent(title);
        const port = getConfig().port;
        const options = {
            headerHtml: 'http://localhost:' + port + '/pdf-header.html?title=' + urlTitle,
            headerSpacing: 5,
            footerSpacing: 5,
            footerHtml: 'http://localhost:' + port + '/pdf-footer.html?title=' + urlTitle,
            marginBottom: '.75in',
            marginTop: '1.25in',
            marginLeft: '.5in',
            marginRight: '.5in'
        };
        return wkhtmltopdf(html, options) as Stream;
    }
}