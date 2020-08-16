import { ExampleRepository } from "../../infrastructure/repositories/Example.repository";


/**
 * List of all created repositories,
 * this is the entry point to the application layer.
 */
export const ListedRepositories = [
    ExampleRepository,
] as const;

/**
 * Façade to instantiate all listed repositories
 */
export const repositoryFacade = (tableName: DynamoTableNames) => {
    const Repository = ListedRepositories.find(repository => repository.dynamoTableName === tableName);

    return new Repository();
}

/**
 * Get all table names from ListedRepositories array.
 */
export const getInjectedSQLTableNames = () => ListedRepositories.map(repository => repository.sqlTableName);

/**
 * Get all table columns from ListedRepositories array.
 */
export const getInjectedSQLTableColumns = () => ListedRepositories.map(repository => repository.sqlTableColumns);

/**
 * Type listing all DynamoDB table names in ListedRepositories array.
 */
export type DynamoTableNames = typeof ListedRepositories[number]["dynamoTableName"];

/**
 * Type listing all SQL table names in ListedRepositories array.
 */
export type SQLTableNames = typeof ListedRepositories[number]["sqlTableName"];