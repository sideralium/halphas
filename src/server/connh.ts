import { host } from './app';
import { createWriteStream, mkdirSync, readFile, readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { get } from 'https';
import { dirname, extname, join } from 'path';

const handler = (request: IncomingMessage, response: ServerResponse) => {
    let path = (new URL(`https://0.0${request.url}`)).pathname;

    if ('.swf' === extname(path) || '.xml' === extname(path) || '.jpg' === extname(path)) {
        if ('.swf' === extname(path)) {
            response.setHeader('Content-Type', 'application/x-shockwave-flash');
        }

        dl(path).then(file => { response.end(file) });
        return;
    }

    switch (path) {
        case '/':
            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });

            response.end(`<body style="margin:0;"><div id="container" style="width: 100%; height: 100%; position: fixed"><object width="100%" height="100%" id="preloader" name="preloader"
data="/spacemap/preloader.swf" type="application/x-shockwave-flash"><param name="allowfullscreen" value="true"><param name="allowscriptaccess" value="always"><param name="quality" value="high"><param name="wmode" value="gpu"><param name="bgcolor" value="#000000"><param name="allowFullScreenInteractive" value="true"><param name="flashvars"value="lang=en&amp;userID=10000000&amp;sessionID=0&amp;basePath=spacemap&amp;pid=1&amp;boardLink=board&amp;helpLink=help&amp;loadingClaim=LOADING&amp;chatHost=localhost&amp;cdn=${host}/&amp;useHash=0&amp;host=${host}&amp;browser=Unknown&amp;fullscreen=1&amp;itemXmlHash=0&amp;resourcesXmlHash=0&amp;resources3dXmlHash=0&amp;resources3dparticlesXmlHash=0&amp;resourceachievementsXmlHash=0&amp;profileXmlHash=0&amp;languageXmlHash=0&amp;loadingscreenHash=0&amp;gameclientHash=0&amp;gameclientPath=spacemap&amp;loadingscreenAssetsXmlHash=0&amp;crossdomainHash=0&amp;gameclientAllowedInitDelay=10&amp;eventStreamContext=0&amp;requestScheme=https&amp;sharedImages=${host}/darkorbit/&amp;useDeviceFonts=0&amp;display2d=2&amp;theme=${host}/do_img/global/loadingscreen/default.jpg&amp;platform=PC_CLIENT&amp;autoStartEnabled=1&amp;mapID=5&amp;allowChat=1"></object></div></body>`);
            break;
        case '/flashAPI/dailyLogin.php':
            response.setHeader('Content-Type', 'application/json');
            response.end('{"success":true}');
            break;
        default:
            console.log(new Date, 'unhandled url requested', path);
            response.writeHead(404);
            response.end();
            break;
    }
}

const dl = async (url: string): Promise<Buffer> => {
    let path = join(__dirname, '..', 'assets', url);

    return new Promise(resolve => {
        readFile(path, {}, (err, data) => {
            if (err) {
                console.info(new Date, 'downloading', url);
                get(`https://darkorbit-22.bpsecure.com${url}`, r => {
                    try { mkdirSync(dirname(path), { recursive: true }) } catch (e) { }

                    const dl = createWriteStream(path);
                    r.pipe(dl);

                    dl
                        .on('finish', () => { dl.close(); resolve(readFileSync(path)) })
                        .on('error', err => { console.error(new Date, err) });
                });
            } else resolve(data);
        });
    });
}

export { handler }
