import { handler } from './connh';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const
    port = 8000,
    options = {
        key: readFileSync(process.env.NODEJS_SSL_KEY || 'key.pem'),
        cert: readFileSync(process.env.NODEJS_SSL_CERT || 'cert.pem'),
    };

export var host: string;
createServer(options, handler).listen({ port, host: '0.0.0.0' }, () => {
    host = `https://localhost:${port}`;
    console.log(`listening on port ${port}`);
});
