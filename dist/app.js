"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
//------------------------------database---------------------------------------------//
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
var produtimageinfo = new mongoose.Schema({
    productid: String,
    productinfo: Object,
});
var product = mongoose.model("product", produtimageinfo);
//-----------------------------server----------------------------------------------//
const app = express_1.default();
const port = 3000;
app.listen(port, () => {
    console.log("server started at ------------------->", port);
});
app.use(bodyParser.json({
    limit: '50mb',
    verify(req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
app.get('/', (req, res) => res.send('Merged Product info for Daniel Wellington is available with the response'));
//-----------------------------scheduler----------------------------------------------//
var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();
//rule.minute = 40;
rule.second = 10;
var scheduledRun = schedule.scheduleJob(rule, function () {
    console.log("**************inside schedule job to call main*******************");
    main();
});
//---------------------------------------------------------------------------//
function mergeAndSaveProductImageInfo(productResult, imageResult) {
    var iResult;
    for (var i = 0; i < productResult.products.length; i++) {
        var pResult = productResult.products[i];
        var pResultSku = productResult.products[i].sku;
        iResult = imageResult.images[pResultSku];
        iResult = iResult.concat(pResult);
        console.log("**************Merging complete*******************");
        console.log(iResult);
        var myData = new product(iResult);
        myData.save()
            .then(item => {
            console.log("merged product info saved to database");
        })
            .catch(err => {
            console.log("Unable to save to database");
        });
    }
}
function fetchMergedJSON(object, id) {
    for (var i = 0; i < object.length; i++) {
        if (object[i].hasOwnProperty('sku')) {
            console.log(object[i].sku);
            if (id == object[i].sku) {
                product.findOne().lean().exec(function (err, doc) {
                    doc.addedProperty = id;
                    // res.json(doc);
                });
            }
        }
    }
}
function sendGetRequestOnProducts(path) {
    return new Promise(function (resolve, reject) {
        axios_1.default.get(path).then((response) => {
            var result = response.data;
            console.log('Processing Product');
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}
function sendGetRequestOnImages(path) {
    return new Promise(function (resolve, reject) {
        axios_1.default.get(path).then((response) => {
            var result = response.data;
            console.log('Processing Image');
            resolve(result);
        }, (error) => {
            reject(error);
        });
    });
}
async function main() {
    var productResult = await sendGetRequestOnProducts('https://assignment.dwbt.tech/products');
    var imageResult = await sendGetRequestOnImages('https://assignment.dwbt.tech/images');
    mergeAndSaveProductImageInfo(productResult, imageResult);
}
//# sourceMappingURL=app.js.map