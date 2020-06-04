const downloader = require("./downloader");

downloader.downloadMusic("https://open.spotify.com/track/6c5YmpkzmCBjCuerCPU6ng?si=1rsX7hRSTgCU2NKGYzA_Ag").then((paths) => { console.log(paths) });
