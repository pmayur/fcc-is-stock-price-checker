const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Viewing one stock', function(done) {

        let stock = 'goog';
        let like = 'false';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.exists(data.stock)
                assert.exists(data.price)
                assert.exists(data.likes)
                assert.equal(data.stock, stock.toUpperCase())
                assert.isNumber(data.price)
                assert.equal(data.likes, 0)
                done()

            })
    })

    test('Viewing one stock and liking it', function(done) {

        let stock = 'goog';
        let like = 'true';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.exists(data.stock)
                assert.exists(data.price)
                assert.exists(data.likes)
                assert.equal(data.stock, stock.toUpperCase())
                assert.isNumber(data.price)
                assert.equal(data.likes, 1)
                done()

            })
    })

    test('Viewing the same stock and liking it again', function(done) {

        let stock = 'goog';
        let like = 'true';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.exists(data.stock)
                assert.exists(data.price)
                assert.exists(data.likes)
                assert.equal(data.stock, stock.toUpperCase())
                assert.isNumber(data.price)
                assert.equal(data.likes, 1)
                done()

            })
    })

    test('Viewing another stock', function(done) {

        let stock = 'msft';
        let like = 'false';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.exists(data.stock)
                assert.exists(data.price)
                assert.exists(data.likes)
                assert.equal(data.stock, stock.toUpperCase())
                assert.isNumber(data.price)
                assert.equal(data.likes, 0)
                done()

            })
    })

    test('Viewing invalid stock', function(done) {

        let stock = 'fasfas';
        let like = 'false';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.notExists(data.stock)
                assert.notExists(data.price)
                assert.exists(data.likes)
                assert.equal(data.likes, 0)
                done()

            })
    })


    test('Viewing two stocks', function(done) {

        let stock = ['goog', 'msft'];
        let like = 'false';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.isArray(data)
                assert.equal(data.length, 2)

                data.forEach((element, index) => {

                    assert.exists(element.stock)
                    assert.exists(element.price)
                    assert.exists(element.rel_likes)
                    assert.equal(element.stock, stock[index].toUpperCase())
                    assert.isNumber(element.price)
                });

                done()

            })
    })

    test('Viewing two stocks', function(done) {

        let stock = ['goog', 'msft'];
        let like = 'true';

        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock, like })
            .end( function(err, res) {
                let data = res.body.stockData;

                assert.equal(res.status, 200)
                assert.exists(res.body.stockData)
                assert.notExists(err)
                assert.isArray(data)
                assert.equal(data.length, 2)

                data.forEach((element, index) => {

                    assert.exists(element.stock)
                    assert.exists(element.price)
                    assert.exists(element.rel_likes)
                    assert.equal(element.stock, stock[index].toUpperCase())
                    assert.isNumber(element.price)
                });

                done()

            })
    })

});
