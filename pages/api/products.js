import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const dbconnection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "products",
      });
      const query = "SELECT * FROM products";
      const [data] = await dbconnection.execute(query);
      dbconnection.end();
      res.status(200).json({ products: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const productName = req.body.product_name;
      const dbconnection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "products",
      });
      const query = "INSERT INTO products (product_name) VALUES (?)";
      const [result] = await dbconnection.execute(query, [productName]);
      dbconnection.end();
      if (result.affectedRows === 1) {
        res
          .status(200)
          .json({
            response: {
              message: "success",
              products: { product_name: productName },
            },
          });
      } else {
        res.status(500).json({ response: { message: "error" } });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const productIdToUpdate = req.body.product_id;
      const productNameToUpdate = req.body.product_name;
      const dbconnection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "products",
      });
      const query = "UPDATE products SET product_name = ? WHERE product_id = ?";
      const [result] = await dbconnection.execute(query, [
        productNameToUpdate,
        productIdToUpdate,
      ]);
      dbconnection.end();
      if (result.affectedRows === 1) {
        res.status(200).json({ response: { message: "success" } });
      } else {
        res.status(500).json({ response: { message: "error" } });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const productId = req.body.product_id;
      const dbconnection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "products",
      });
      const query = "DELETE FROM products WHERE product_id = ?";
      const [result] = await dbconnection.execute(query, [productId]);
      dbconnection.end();
      if (result.affectedRows === 1) {
        res
          .status(200)
          .json({ response: { message: "success", product_id: productId } });
      } else {
        res.status(500).json({ response: { message: "error" } });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(404).json({ error: "Not Found" });
  }
}
