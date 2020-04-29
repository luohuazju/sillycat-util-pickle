(async () => {
	const AWS = require('aws-sdk');
    const DynamoDBWrapper = require('dynamodb-wrapper');
    const AttributeValue = require('dynamodb-data-types').AttributeValue;
    const fs = require('fs');
    
	console.log(`----- start to scan target table  -----\n`);


	console.log(`----- target table scan finished -----\n`);
})()