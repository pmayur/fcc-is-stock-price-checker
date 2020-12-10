"use strict";
const helmet = require("helmet");
const axios  = require("axios");

let database = require("../db/database")

module.exports = function (app) {
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
            },
        })
    );

    app.route("/api/stock-prices").get( async function (req, res) {

        let ip          = req.connection.remoteAddress;
        let isLiked     = convertToBoolean(req.query.like);
        let stock       = req.query.stock.toUpperCase();

        try {

            stock = await getStockData(stock, ip, isLiked);

        } catch (error) {
            return res.json(error)
        }

        return res.json({stockData: stock})
    });
};


// HELPER FUNCTIONS

// returns stockData object { stock, price, likes }
function getStockData(stock, ip, isLiked) {

    return new Promise( async (resolve, reject) => {
        try {

            stock = {
                stock,
                price: await getPrice(stock),
                likes: getLikes(stock,ip,isLiked)
            }

            if (!stock.price) {
                delete stock.stock;
                delete stock.price;
            }

            resolve(stock);

        } catch (error) {
            reject(error);
        }
    })


}

// returns url for getting the particular stock
function stockPriceUrl(stock) {
    return `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
}

// returns price for the stock from the url
// returns undefined for invalid stock provided
function getPrice(stock) {

    let url = stockPriceUrl(stock);

    return new Promise( async (resolve, reject) => {
        try {

            // response contains stock details for valid stocks
            // contains "unknown stock" for invalid stocks
            let response = await axios.get(url)

            let price = response.data.latestPrice;

            if (price) {
                resolve(price); // if price present
            } else {
                resolve(undefined); // if price is not present for stock
            }

        } catch (error) {
            reject(undefined)
        }
    })
}

// returns likes for particular stock
function getLikes(stock, ip, isLiked) {

    // if the database does not have the stock
    if ( ! database.store.has(stock) ) {

        // create a new entry for the stock in the database
        database.store.set(stock, new Map());
    }

    // get the ip address map for the given stock
    let ipMap = database.store.get(stock);

    // if isliked add the ip to the ip address map
    if ( isLiked ) {
        ipMap.set(ip, "");
        database.store.set(stock, ipMap);
    }

    // get the size of the ip adress map for the given stock
    return database.store.get(stock).size;

}

// returns true / false from boolean string provided
function convertToBoolean(bool) {
    return (String(bool) == "true");
}