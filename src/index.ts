import { recursiveMigrate } from "./application/recursiveMigrate";
import { ListedRepositories } from "./domain/facade/repository.facade";


ListedRepositories.forEach(RepositoryClass => {
    recursiveMigrate(RepositoryClass.dynamoTableName, RepositoryClass.sqlTableName);
});
