import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "sb_consumer",
  port: 8889,
  password: "rUg7Qfz-pOigde_P",
  database: "scoreboard_data",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock", //path to mysql sock in MAMP
});
