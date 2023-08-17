import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const productNameRef = useRef();
  const productIdToUpdateRef = useRef();
  const productNameToUpdateRef = useRef();
  const productIdToDeleteRef = useRef();
  const [created, setCreated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [updatedError, setUpdatedError] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deletedError, setDeletedError] = useState(false);

  async function addProduct(event) {
    event.preventDefault();
    const productName = productNameRef.current.value.trim();
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: productName,
      }),
    };
    if (productName.length < 3) return;
    const res = await fetch("/api/products", postData);
    const response = await res.json();
    if (response.response.message !== "success") return;
    setCreated(true);
    productNameRef.current.value = "";
    getProducts();
  }

  async function getProducts() {
    try {
      const res = await fetch("/api/products");
      const response = await res.json();
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function updateProduct() {
    const productIdToUpdate = productIdToUpdateRef.current.value.trim();
    const productNameToUpdate = productNameToUpdateRef.current.value.trim();
    if (!productNameToUpdate.length) return;
    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productIdToUpdate,
        product_name: productNameToUpdate,
      }),
    };
    const res = await fetch("/api/products", postData);
    const response = await res.json();
    if (response.response.message !== "success") {
      setUpdatedError(true);
    } else {
      setUpdated(true);
      productIdToUpdateRef.current.value = "";
      productNameToUpdateRef.current.value = "";
      getProducts();
    }
  }

  async function deleteProduct() {
    const productIdToDelete = productIdToDeleteRef.current.value.trim();
    if (!productIdToDelete) return;
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productIdToDelete,
      }),
    };
    const res = await fetch("/api/products", postData);
    const response = await res.json();
    if (response.response.message !== "success") return;
    setDeleted(true);
    productIdToDeleteRef.current.value = "";
    getProducts();
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <h2>Read</h2>
      <div>
        {products.map((product) => (
          <div key={product.product_id}>
            <span>product_id</span>: {product.product_id} <br />
            <span>product_name</span>: {product.product_name}{" "}
            <button onClick={() => deleteProduct(product.product_id)}>
              Delete
            </button>{" "}
            <br />
          </div>
        ))}
      </div>
      <div>
        <h2>Create</h2>
        <div>
          <form onSubmit={addProduct}>
            <div className="modal-header">
              <h4 className="modal-title">Add Product</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="product_name"
                  ref={productNameRef}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <input
                type="button"
                className="btn btn-default"
                name="submit"
                data-dismiss="modal"
                value="Cancel"
              />
              <input type="submit" className="btn btn-success" value="Add" />
            </div>
          </form>
          {created ? <div>Product added successfully!</div> : null}
        </div>
        <h2>Update</h2>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            name="productIdToUpdate"
            ref={productIdToUpdateRef}
            required
          />
          <br />
          <br />

          <label>Product Name:</label>
          <input
            type="text"
            name="productNameToUpdate"
            ref={productNameToUpdateRef}
            required
          />
          <br />
          {updated ? <div>Product updated successfully!</div> : null}
          {updatedError ? <div>Error updating product!</div> : null}
          <button type="button" onClick={updateProduct}>
            Update
          </button>
          <br />
          <br />
        </div>
        <div>
          <h2>Delete</h2>
          <br />
          <div>
            <label htmlFor="productIdToDelete">Product ID:</label>
            <input
              type="text"
              id="productIdToDelete"
              name="productIdToDelete"
              ref={productIdToDeleteRef}
              required
            />
            <br />

            <button type="button" onClick={deleteProduct}>
              Delete
            </button>

            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
