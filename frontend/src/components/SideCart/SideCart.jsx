import React from 'react';
import './SideCart.css';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Sidecart = ({ showCart, setShowCart }) => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowCart(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('sidecart-overlay')) {
      handleClose();
    }
  };

  return (
    <div
      className={`sidecart-overlay ${showCart ? 'visible' : ''}`}
      onClick={handleOutsideClick}
    >
      <div className={`sidecart ${showCart ? 'slide-in' : 'slide-out'}`}>
        {/* Header */}
        <div className="sidecart-header">
          <h2 className="header-title">My Order</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <hr className="header-underline" />

        {/* Content */}
        <div className="sidecart-content">
          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div className="sidecart-item" key={item._id}>
                  <img src={`${url}/images/${item.image}`} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">
                      Qty: {cartItems[item._id]}
                      
                    </p>
                    
                  </div>
                  <div className="item-info">
      <div className="item-price">Rs.{item.price * cartItems[item._id]}</div>
      <button
        className="delete-button"
        onClick={() => removeFromCart(item._id)}
      >
        🗑
      </button>
    </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Footer */}
        <div className="sidecart-footer">
          <div className="total">
            <div className="total-details">
              <span>Subtotal</span>
              <span>Rs.{getTotalCartAmount()}.00</span>
            </div>
            <div className="total-details">
              <span>Delivery Fee</span>
              <span>Rs.{getTotalCartAmount() === 0 ? 0 : 2}.00</span>
            </div>
            <div className="total-details total-bold">
              <b>Total</b>
              <b>Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}.00</b>
            </div>
          </div>
          <button
            className="checkout-button"
            onClick={() => {
              handleClose();
              navigate('/order');
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidecart;
