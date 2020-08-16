import { DynamoDB } from "aws-sdk";
import fs from "fs";
import * as Knex from "knex";
import knex from "../../../config/knexConnection";
import { SQLTableNames } from "../../domain/facade/repository.facade";


export default abstract class BaseRepository {
    /**
     * TableName existing inside DynamoDB.
     */
    public static readonly dynamoTableName: string;

    /**
     * TableName that will be created in the SQL database.
     */
    public static readonly sqlTableName: string;

    /**
     * this.sqlTableColumns assert that all column names and data types 
     * will remains consistent across whole application.
     */
    public static readonly sqlTableColumns: readonly ISQLTableColumn[];

    /**
     * Format DynamoDB.AttributeMap data and then insert in SQL database
     */
    public async insert(sqlTableName: SQLTableNames, item: DynamoDB.AttributeMap) {
        const builtItem = this.factory(item);
        this.insertBuiltItem(sqlTableName, builtItem);
    }

    /**
     * Build table item from DynamoDB.AttributeMap, it must return object that will be written 
     * in the database using { sql_column_name: "Data from DynamoDB" } format.
     */
    protected factory(item: DynamoDB.AttributeMap): Record<ISQLTableColumn["columnName"], any> {
        return {} as any;
    }

    /**
     * Method for insertion of data to the SQL database.
     */
    protected async insertBuiltItem(sqlTableName: SQLTableNames, builtItem: any) {
        try {
            await knex(sqlTableName).insert(builtItem);
        } catch (error) {
            fs.appendFileSync(`./debug/${sqlTableName}.data.txt`, JSON.stringify(builtItem), { encoding: 'utf-8', flag: "as" });
            fs.appendFileSync(`./debug/${sqlTableName}.error.txt`, JSON.stringify(error), { encoding: 'utf-8', flag: "as" });
        }
    }

    /**
     * Loop through items running this.insert(item).
     */
    public async bulkInsert(sqlTableName: SQLTableNames, Items: DynamoDB.AttributeMap[]) {
        Items.forEach(async (item) => await this.insert(sqlTableName, item));
    }
}

/**
 * Key of knex functions to run during migrations.
 */
export type CreateTableFunctions = keyof Knex.CreateTableBuilder;

export interface ISQLTableColumn {
    columnType: CreateTableFunctions;
    columnName: string;
    length?: number;
}