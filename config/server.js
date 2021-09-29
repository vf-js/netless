const liveServer = require('live-server');

liveServer.start({
    port: 5500,
    mount: ['../node_modules'],
    file: 'index.html',
    open: '/dist/index.html?total=100&debug=true&url=/demo/demo.json',

});
