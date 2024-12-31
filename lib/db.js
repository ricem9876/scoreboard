import mysql from "mysql2/promise";

let pool; // Reuse pool across requests to avoid exhausting connections

export const db = {
  query: async (sql, params = []) => {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 5, // Match your provider's max connection limit
        queueLimit: 0, // Unlimited request queue
      });
    }

    // Execute query and return the results
    return pool.query(sql, params);
  },
  shutdownHandler: async function () {
    if (pool) {
      try {
        const res = await pool.killConnection(); // Assuming you exported killConnection
        res.status(200).json({ message: "Connection pool closed." });
      } catch (error) {
        console.error("Error closing connection pool:", error);
        // res.status(500).json({ message: "Failed to close connection pool." });
      }
    }
  },
};
