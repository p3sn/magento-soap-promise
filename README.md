# Magento Client

Author: Peter Driessen - info@studioio.io

This module let's you connect with a Magento 1.x webshop via SOAP V2 using the wsdl method. I still need to add a lot of methods, but I also explained how to create a custom method on your own. 

Hope this helps you. Please let me know if you have any questions or comments. 

Regards, Peter

## Usage

```javascript

// Copyright 2017 Peter Driessen - info@studioio.io
// MIT License: https://opensource.org/licenses/MIT

'use strict';

const magentoClient = require('./magento-soap-promise.js')

var mag = new magentoClient('https://www.yourdomain.com/api/v2_soap/?wsdl', 'Username', 'ApiKey');

mag.connect().then( sessionid => {
	return mag.getOrder('900000744');
}).then((result) => {
	console.log(JSON.stringify(result));
}).catch( error => {
	console.log(error);
})

```


## Sales Orders Methods

#### getOrder(increment_id)
Get information about a single order

#### getPendingOrders()
Get all pending sales orders

#### getProcessingOrders()
Get all processing orders

#### commentOrder(increment_id, status, comment)
Add comment to an order, including new status and a comment description

## Order Shipments Methods

#### getShipment(shipment_id)
Get shipment information

#### commentShipment(shipment_id, comment)
Add comment to a shipment

#### createShipment(increment_id, comment)
Create a shipment for an order, including a comment

## Catalog Methods
#### getProduct(product_id)
Get product information

#### getStock(productArr)
Get stock information about one or more products, argument is an array of product ID's

#### setStock(product_id, qty)
Update stock quantity for a single product

#### And more to follow...

## Custom methods
Basically all methods above make use of the custom method. You can create any method you want, based on the Magento documentation. 
http://devdocs.magento.com/guides/m1x/api/soap/introduction.html

### Example how to create your own method:
1. Go to http://devdocs.magento.com/guides/m1x/api/soap/catalogInventory/cataloginventory_stock_item.update.html
2. Have a look at the SOAP V2 example
3. Copy the method behind $result = $proxy->, which is: **catalogInventoryStockItemUpdate**
4. Have a look at the wsdl file you used to connect and search for **catalogInventoryStockItemUpdate** 
5. You will find this piece of code:
	
	```html
	<message name="catalogInventoryStockItemUpdateRequest">
		<part name="sessionId" type="xsd:string"/>
		<part name="product" type="xsd:string"/>
		<part name="data" type="typens:catalogInventoryStockItemUpdateEntity"/>
	</message>
	```

6. SessionId is always send along our custom method, product needs a string and data is an argument as well. You have seen these arguments in the documentation at step 1 if it's correct.
7. You can construct the arguments object like this: 
	
	```javascript
	var args = {
		product: '2227',
		data: { 
			qty: '46' 
		}
	}
	```
8. You can now use your custom method like in this full example:

	```javascript	
	'use strict';
	
	const mag = require('./magentoClient2');
	var mag = new magentoClient();
	mag.connect('https://www.yourdomain.com/api/v2_soap/?wsdl', 'username', 'apiKey').then( sessionid => {
	
		// arguments
		var args = {
			product: '2227',
			data: { 
				qty: '46' 
			}
		}
		return mag.customCall('catalogInventoryStockItemUpdate', args);
	
	}).then((result) => {
	
		// output result in JSON
		console.log(JSON.stringify(result));
	
	})
	
	```


