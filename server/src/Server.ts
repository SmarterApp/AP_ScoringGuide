import * as Express from 'express';
import * as Path from 'path';
import { APIRoute } from './routes/API';
import { ItemParser } from './ItemParser';
import { getConfig } from "./Config";

const port = getConfig().port;
const apiRoute = new APIRoute();
const app = Express();
app.use(Express.static(Path.join(__dirname, '../../../../client/dist')));

//TODO: change to post and add body-parser
app.use('/api', apiRoute.router);

app.get('/ScoringGuide', (req, res) => {
    res.status(200).sendFile(Path.join(__dirname, '../../client/dist/index.html'));
});

app.get('/item', (req, res) => {
    const id = req.param('id', '') as string;
    const ip = new ItemParser();
    ip.loadPlainHtml(id)
        .then(item => res.send(item))
        .catch(err => res.status(500).send(err));
})

app.get('*', (req, res) => {
    res.status(400).sendFile(Path.join(__dirname, '../../client/dist/404.html'));
})

app.listen(port, () => console.log('Server started on port', port));


export const startServer = (portNumber?: number) => {
    const listeningPort = portNumber ? portNumber : port
    return app.listen(listeningPort, () => console.log('Server started on port', listeningPort));
};

