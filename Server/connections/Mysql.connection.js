import mysql from "mysql2";
import { environment } from "../enviroment/enviroment.js";

const { user, password, port, host } = environment.mysql;

const MySqlCon = mysql.createConnection({
  user: user,
  password: password,
  port: port,
  host: host, // db for docker
});

MySqlCon.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Mysql Connected");
  MySqlCon.query("Use Users");
  console.log("Using Users schema...");
});
export const MysqlConnection = MySqlCon;
