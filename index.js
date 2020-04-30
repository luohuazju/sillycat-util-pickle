(async () => {
	const AWS = require('aws-sdk');
    const DynamoDBWrapper = require('dynamodb-wrapper');
    const AttributeValue = require('dynamodb-data-types').AttributeValue;
    const fs = require('fs');
    const pickle = require('pickle');

    console.log(`----- init the connection and config-----\n`);
    AWS.config.update({region: 'us-west-1'});
    const dynamoDB = new AWS.DynamoDB({ maxRetries: 0 });
    const dynamoDBWrapper = new DynamoDBWrapper(dynamoDB, {
        // optionally enable DynamoDBWrapper retry logic
        maxRetries: 6,
        retryDelayOptions: { base: 100 }
    });

    const tableScanParams = {
        TableName: 'betaCluster-IdPConfiguration',
        ProjectionExpression: 'enterprise, idp'
    };

	console.log(`----- start to scan target table  -------\n`);
    const allIdps = await dynamoDBWrapper.scan(tableScanParams);

    let i = 1;
    for (const wrappedItem of allIdps.Items) {
        const idp = AttributeValue.unwrap(wrappedItem);
        i++;
        if (idp.idp) {
        	pickle.loads(idp.idp, function(orgIdp) {
    			console.log( i + " info: ", orgIdp.groupUUID);
  			});
        }
        //console.log(i + ":" + JSON.stringify(idp.enterprise));
        
        //fs.appendFileSync('./data/idp_enterprise.json', idp.enterprise + "\n");
        //fs.appendFileSync('./data/idp_pickle.json', idp.idp + "\n");
    }

	console.log(`----- target table scan finished --------\n`);
})()