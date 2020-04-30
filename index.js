(async () => {
	const AWS = require('aws-sdk');
    const DynamoDBWrapper = require('dynamodb-wrapper');
    const AttributeValue = require('dynamodb-data-types').AttributeValue;
    const fs = require('fs');

    console.log(`----- init the connection and config-----\n`);
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
        console.log(i + ":" + JSON.stringify(idp));
        i++;
        fs.appendFileSync('./idp_enterprise.json', idp.enterprise + "\n");
    }

	console.log(`----- target table scan finished --------\n`);
})()