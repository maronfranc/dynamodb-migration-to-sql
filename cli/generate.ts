import fs from "fs";
import { repositorySketch } from "./repositorySketch";

const CLI_REPOSITORY_NAME_POSITION = 2;
const CLI_COLUMNS_START = 3;
const PASCAL_CASE_REPOSITORY_NAME = process.argv[CLI_REPOSITORY_NAME_POSITION];

const columnNames: string[] = [];
for (let i = CLI_COLUMNS_START; i < process.argv.length; i++) {
    columnNames.push(process.argv[i]);
}

const FOLDER_REPOSITORY_PATH = "./src/infrastructure/repositories"
const FILE_PATH = `${FOLDER_REPOSITORY_PATH}/${PASCAL_CASE_REPOSITORY_NAME}.repository.ts`

console.log(" ----- ----- |-Generating repository-| ----- ----- ");
console.log("path: " + FILE_PATH);

fs.writeFileSync(FILE_PATH, repositorySketch(PASCAL_CASE_REPOSITORY_NAME, columnNames), { encoding: 'utf-8' });
