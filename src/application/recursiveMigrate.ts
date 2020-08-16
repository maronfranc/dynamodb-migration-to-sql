import { AWSError, DynamoDB } from "aws-sdk";
import { DynamoTableNames, repositoryFacade, SQLTableNames } from "../domain/facade/repository.facade";


const AWS_REGION = "region";

export const recursiveMigrate = async (dynamoDBTableName: DynamoTableNames, sqlTableName: SQLTableNames) => {
    const dynamodb = new DynamoDB({ region: AWS_REGION });
    const repository = repositoryFacade(dynamoDBTableName);

    const onScan = (err: AWSError, data: DynamoDB.ScanOutput) => {
        if (err) console.error(err, err.stack);
        else {
            const { Items, LastEvaluatedKey } = data;

            if (typeof LastEvaluatedKey != "undefined") {
                repository.params.ExclusiveStartKey = LastEvaluatedKey;
                dynamodb.scan(repository.params, onScan);
            }

            repository.bulkInsert(sqlTableName, Items);
        }
    }

    dynamodb.scan(repository.params, onScan);
}