

// Copyright 2017 Peter Driessen
// MIT License: https://opensource.org/licenses/MIT

'use strict';

const soap = require('strong-soap').soap;


function MagentoClient(url, username, apiKey) {
    this.url = url;
    this.username = username;
    this.apiKey = apiKey;
    this.client = {};
    this.sessionid = '';
}

MagentoClient.prototype.connect = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        var options = {};
        soap.createClient(that.url, options, function(err, client) {
            that.client = client;
            var args = {
                username: that.username,
                apiKey: that.apiKey
            }
            client.login(args, function(err, result) {
                if(err) reject(err);
                that.sessionid = result.loginReturn.$value;
                resolve(result.loginReturn.$value);
            });
        });
    });    
}

MagentoClient.prototype.customCall = function(fn, subargs) {
    var that = this;
    return new Promise(function(resolve, reject) {
        var args = { sessionId: that.sessionid }
        if(subargs) args = Object.assign({}, args, subargs);
        that.client[fn](args, function(err, result) {
            if(err) reject(err.body);
            resolve(result);
        });
    });
}

// ORDERS

// method: getOrder
MagentoClient.prototype.getOrder = function(increment_id) {
    var subargs={orderIncrementId:increment_id};
    return this.customCall('salesOrderInfo', subargs);  
}

// method: getPendingOrders
MagentoClient.prototype.getPendingOrders = function() {
    var subargs={filters:{filter:{item:{key:"status",value:"pending"}}}};
    return this.customCall('salesOrderList', subargs);   
}

// method: getProcessingOrders
MagentoClient.prototype.getProcessingOrders = function() {
    var subargs={filters:{filter:{item:{key:"status",value:"processing"}}}};
    return this.customCall('salesOrderList', subargs);   
}

// method: commentOrder
MagentoClient.prototype.commentOrder = function(increment_id, status, comment) {
    var subargs={orderIncrementId:increment_id,status:status,comment:comment};
    return this.customCall('salesOrderAddComment', subargs);   
}

// ORDER SHIPMENTS

// method: getShipment
MagentoClient.prototype.getShipment = function(shipment_id) {
    var subargs={shipmentIncrementId:shipment_id};
    return this.customCall('salesOrderShipmentInfo', subargs);   
}

// method: commentShipment
MagentoClient.prototype.commentShipment = function(shipment_id, comment) {
    var subargs={shipmentIncrementId:shipment_id,comment:comment};
    return this.customCall('salesOrderShipmentAddComment', subargs);   
}

// method: createShipment
MagentoClient.prototype.createShipment = function(increment_id, comment) {
    var subargs={orderIncrementId:increment_id,comment:comment};
    return this.customCall('salesOrderShipmentCreate', subargs); 
}

// CATALOG

// method: getProduct
MagentoClient.prototype.getProduct = function(product_id) {
    var subargs={productId:product_id};
    return this.customCall('catalogProductInfo', subargs);     
}

// method: getStock
MagentoClient.prototype.getStock = function(productArr) {
    if(!Array.isArray(productArr)) throw 'first argument is not an Array of product id\'s';
    var subargs={products:{product_id:productArr}};
    return this.customCall('catalogInventoryStockItemList', subargs);   
}

// method: setStock
MagentoClient.prototype.setStock = function(product_id, qty) {
    if( typeof product_id !== 'string' ) throw 'first argument is not a product ID string';
    if(!Number.isInteger(qty)) throw 'second argument is not an integer'
    var subargs={product:product_id,data:{qty:qty}};
    return this.customCall('catalogInventoryStockItemUpdate', subargs);    
}

module.exports = MagentoClient;