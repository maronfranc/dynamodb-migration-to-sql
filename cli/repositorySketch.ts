const LIMIT = 100;

const pascalToSnakeCase = (s: string) => s.replace(/\.?([A-Z])/g, (y) => "_" + y.toLowerCase()).replace(/^_/, "")
const pascalToCamelCase = (s: string) => s.substring(0, 1).toLowerCase() + s.substring(1);

const generateTemplate = (columnNames: string[], templateCallback: (c: string) => string) =>
    columnNames.map(columnName => templateCallback(columnName));
const generateColumnType = (columnName: string, defaultKnexFunction = "string") => 
    columnName === "id" ? `increments` : defaultKnexFunction;

export const repositorySketch = (PascalCaseRepositoryName: string, columnNames: string[]): string =>
`import { DynamoDB } from "aws-sdk";

import BaseRepository from "./BaseRepository";

export class ${PascalCaseRepositoryName}Repository extends BaseRepository {
    public static readonly dynamoTableName = "${pascalToCamelCase(PascalCaseRepositoryName)}";
    public static readonly sqlTableName = "${pascalToSnakeCase(PascalCaseRepositoryName)}";
    public static readonly sqlTableColumns = [${generateTemplate(columnNames, (columnName) =>
        `\n\t\t{columnType: "${generateColumnType(columnName)}", columnName: "${columnName}" }`)}
    ] as const;
    private _params: DynamoDB.ScanInput = {
        TableName: ${PascalCaseRepositoryName}Repository.dynamoTableName,
        ExpressionAttributeNames: {${generateTemplate(columnNames, (columnName) => 
            `\n\t\t\t"#${columnName[0]}${columnName[1]}" : "${columnName}"`)}
        },
        ProjectionExpression: "#id, #es, #am",
        Limit: ${LIMIT},
    }
    get params(): DynamoDB.ScanInput { return this._params }
    set params(params: DynamoDB.ScanInput) { this._params = params }

    protected factory(dynamodbItem: DynamoDB.AttributeMap): BuiltItem {
        const item = DynamoDB.Converter.unmarshall(dynamodbItem);

        return {${generateTemplate(columnNames, (columnName) =>
            `\n\t\t\t${columnName}: item.${columnName}`)}
        };
    }
}

type SQLTableColumns = typeof ${PascalCaseRepositoryName}Repository.sqlTableColumns[number];
type BuiltItem = Record<Partial<SQLTableColumns["columnName"]>, any>;
`;
