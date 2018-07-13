var express = require('express'),
    cors = require('cors'),
    app = express(),
    faker = require('faker');

app.set('port', process.env.PORT || 5000);

var router = new express.Router();

router.get('/hello', cors(), function(req, res) {
    req.on('data', function(data){
        console.log(JSON.parse(data).device);
    });
    res.json(JSON.stringify({
        name: faker.name.findName(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar()
    }));
});

router.post('/fakedata', cors(), function(req, res) {
    
    req.on('data', function(data){
        var parsed = JSON.parse(data);
        console.log(parsed.device, parsed.status);
    });

    res.json(JSON.stringify({
        name: faker.name.findName(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        bio: faker.lorem.sentence(),
        image: faker.image.avatar()
    }));
});

app.use('/', router);

var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});