import express from 'Express';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

var server = express();

server.use(express.static(__dirname + "/public/"))

server.listen(3011, () => {
    console.log("up on 3011")
})