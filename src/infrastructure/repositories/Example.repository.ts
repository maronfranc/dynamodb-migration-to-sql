import { DynamoDB } from "aws-sdk";
import BaseRepository from "./Base.repository";


export class ExampleRepository extends BaseRepository {
    public static readonly dynamoTableName = "examples";
    public static readonly sqlTableName = "sql_examples";
    public static readonly sqlTableColumns = [
        { columnType: "increments", columnName: "id" },
        { columnType: "string", columnName: "username" },
        { columnType: "jsonb", columnName: "body" },
        { columnType: "string", columnName: "token", length: 1000 },
    ] as const;
    private _params: DynamoDB.ScanInput = {
        TableName: ExampleRepository.dynamoTableName,
        ExpressionAttributeNames: {
            "#id": "id",
            "#bd": "body",
            "#tk": "token",
            "#un": "username",
        },
        ProjectionExpression: "#id, #bd, #tk, #un",
        Limit: 100,
    }
    get params(): DynamoDB.ScanInput { return this._params }
    set params(params: DynamoDB.ScanInput) { this._params = params }

    protected factory(dynamodbItem: DynamoDB.AttributeMap): BuiltItem {
        const item = DynamoDB.Converter.unmarshall(dynamodbItem);

        return {
            id: item.id,
            body: item.body,
            token: item.token,
            username: item.username,
        };
    }
}

type SQLTableColumns = typeof ExampleRepository.sqlTableColumns[number];
type BuiltItem = Record<Partial<SQLTableColumns["columnName"]>, any>;
