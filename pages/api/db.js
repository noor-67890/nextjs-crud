import mysql from "mysql2/promise";

export default async function getDbDataHandler(req, res) {
  try {
    // Create the database connection
    const dbconnection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "products",
    });

    const query = "SELECT * FROM products";
    const values = [];
    const [data] = await dbconnection.execute(query, values);

    // Close the database connection after executing the query
    dbconnection.end();
    return data;
    res.status(200).json({ products: data });
  } catch (error) {
    throw Error(error.message);
  }
}
