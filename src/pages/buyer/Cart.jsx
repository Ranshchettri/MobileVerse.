// // src/pages/buyer/Cart.js
// import React, { useEffect, useState } from "react";
// import { Table, Container, Button } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   increaseQuantity,
//   decreaseQuantity,
//   removeFromCart,
// } from "../../store/slices/cartSlice";
// import { useNavigate } from "react-router-dom";
// import api from "../../utils/api";

// const Cart = () => {
//   const cart = useSelector((state) => state.cart.items);
//   console.log(cart);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [payment, setPayment] = useState("advance"); // "cod" or "advance"
//   const [selectedItems, setSelectedItems] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const ids = cart.map((item) => item.id).join(",");
//         const res = await api.get(`/products/?ids=${ids}`);
//         setProducts(res.data);
//       } catch {
//         setProducts([]);
//       }
//     };
//     if (cart.length > 0) fetchProducts();
//   }, [cart]);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     console.log("Cart Rendered");
//   }, []);

//   const total = cart.reduce(
//     (acc, item) =>
//       acc + (item.price - (item.discount || 0)) * (item.quantity || 1),
//     0
//   );

//   const handleAddToCart = async (product_id, quantity) => {
//     try {
//       await api.post("/api/cart/", { product_id, quantity });
//       // Optionally update cart state or show success message
//     } catch (err) {
//       // Handle error
//       alert("Failed to add to cart.");
//     }
//   };

//   const handleSelectItem = (id) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Your Cart</h2>
//       {cart.length === 0 ? (
//         <p>No items in cart.</p>
//       ) : (
//         <>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Select</th>
//                 <th>Name</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Subtotal</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cart.map((item) => (
//                 <tr key={item.id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedItems.includes(item.id)}
//                       onChange={() => handleSelectItem(item.id)}
//                     />
//                   </td>
//                   <td>{item.name}</td>
//                   <td>
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => dispatch(decreaseQuantity(item.id))}
//                       className="me-2"
//                       disabled={item.quantity <= 1}
//                     >
//                       -
//                     </Button>
//                     {item.quantity}
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => dispatch(increaseQuantity(item.id))}
//                       className="ms-2"
//                     >
//                       +
//                     </Button>
//                   </td>
//                   <td>{item.price - (item.discount || 0)}</td>
//                   <td>
//                     {(item.price - (item.discount || 0)) * (item.quantity || 1)}
//                   </td>
//                   <td>
//                     <div style={{ position: "relative" }}>
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         width={50}
//                         height={50}
//                       />
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         style={{
//                           position: "absolute",
//                           top: 0,
//                           right: 0,
//                           background: "transparent",
//                           border: "none",
//                           color: "#dc3545",
//                         }}
//                         onClick={() => dispatch(removeFromCart(item.id))}
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="3">
//                   <strong>Total</strong>
//                 </td>
//                 <td>
//                   <strong>{total}</strong>
//                 </td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </Table>
//           {/* Payment Options */}
//           <div className="mb-3 d-flex gap-3">
//             <Button
//               variant={payment === "cod" ? "success" : "outline-success"}
//               onClick={() => setPayment("cod")}
//               disabled={payment === "advance"}
//             >
//               {payment === "cod" ? "✔ " : ""}Cash on Delivery
//             </Button>
//             <Button
//               variant={payment === "advance" ? "success" : "outline-success"}
//               onClick={() => setPayment("advance")}
//               disabled={payment === "cod"}
//             >
//               {payment === "advance" ? "✔ " : ""}Advance Payment
//             </Button>
//           </div>
//           <div className="d-flex justify-content-end">
//             <Button
//               variant="success"
//               onClick={() => navigate("/checkout")}
//               disabled={selectedItems.length === 0 || !payment}
//             >
//               Proceed to Checkout
//             </Button>
//           </div>
//         </>
//       )}
//     </Container>
//   );
// };

// export default Cart;
const Cart = () => null;
export default Cart;
