import React from 'react';
import { FaHome, FaBars, FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import './BottomNav.css';

export default function BottomNav({ onNav }) {
  const items = [
    { key: 'home', icon: <FaHome />, label: 'Home' },
    { key: 'menu', icon: <FaBars />, label: 'Menu' },
    { key: 'search', icon: <FaSearch />, label: 'Szukaj' },
    { key: 'account', icon: <FaUser />, label: 'Konto' },
    { key: 'wishlist', icon: <FaHeart />, label: 'Ulubione' },
    { key: 'cart', icon: <FaShoppingCart />, label: 'Koszyk' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.key} onClick={() => onNav(item.key)}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
