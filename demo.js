

// Copyright 2017 Peter Driessen
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