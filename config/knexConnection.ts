import Knex from "knex";
import { connection } from "./knexfile";

const createKnexConnection = (): Knex => {
  return Knex({
    client: "pg",
    connection
  });
}

export default createKnexConnection();