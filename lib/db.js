import mysql from "mysql2/promise";

let pool; // Reuse pool across requests to avoid exhausting connections

export const db = {
  query: async (sql, params = []) => {
    if (!pool) {
      const poolConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        maxIdle: 3,
        waitForConnections: true,
        idleTimeout: 60000,
        connectionLimit: 5, // Match your provider's max connection limit
        queueLimit: 0, // Unlimited request queue
      };
      if (process.env.NODE_ENV === "development") {
        poolConfig.socketPath = "/Applications/MAMP/tmp/mysql/mysql.sock";
      }
      pool = mysql.createPool(poolConfig);
      console.log("Connection pool created.");
    }
    // Execute query and return the results
    return pool.query(sql, params);
  },
  shutdownHandler: async function (req, res) {
    if (pool) {
      try {
        // Properly close the pool
        await pool.end();
        console.log("Connection pool closed.");
        if (res) {
          res.status(200).json({ message: "Connection pool closed." });
        }
      } catch (error) {
        console.error("Error closing connection pool:", error);
        if (res) {
          res.status(500).json({ message: "Failed to close connection pool." });
        }
      }
    } else {
      console.log("No pool to close.");
      if (res) {
        res.status(200).json({ message: "No pool to close." });
      }
    }
  },
};
