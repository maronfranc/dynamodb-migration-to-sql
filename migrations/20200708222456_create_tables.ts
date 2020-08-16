import * as Knex from "knex";
import { getInjectedSQLTableColumns, getInjectedSQLTableNames } from "../src/domain/facade/repository.facade";
import { ISQLTableColumn } from "../src/infrastructure/repositories/Base.repository";


const sqlTableNames = getInjectedSQLTableNames();
const sqlTableColumns = getInjectedSQLTableColumns();

export async function up(knex: Knex): Promise<any> {
    /**
     * Run createTable for all repositories listed in repository façade
     */
    sqlTableNames.forEach(async (tableName, index) => {
        await knex.schema.createTable(tableName, (table) => {
            sqlTableColumns[index].forEach((tableColumn: ISQLTableColumn) => {
                // @ts-ignore
                table[tableColumn.columnType](tableColumn.columnName, tableColumn.length);
            });
        });
    });
}

export async function down(knex: Knex): Promise<any> {
    const dropPromises = sqlTableNames.map(async (tableName) => () => knex.schema.dropTable(tableName));
    Promise.all(dropPromises);
}

