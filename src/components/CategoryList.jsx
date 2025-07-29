import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css"; // We’ll create this for styles
import { FaTimesCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const CategoryList = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Dummy category data (we’ll replace with backend later)
  const categories = [
    {
      id: 1,
      name: "Mobile Phones",
      productCount: 124,
      image:
        "https://readdy.ai/api/search-image?query=modern%20smartphone%20mobile%20phone%20with%20sleek%20design%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=mobile001&orientation=squarish",
    },
    {
      id: 2,
      name: "Laptops",
      productCount: 87,
      image:
        "https://readdy.ai/api/search-image?query=premium%20laptop%20computer%20with%20open%20screen%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=laptop002&orientation=squarish",
    },
    {
      id: 3,
      name: "Watches",
      productCount: 56,
      image:
        "https://readdy.ai/api/search-image?query=luxury%20smartwatch%20with%20modern%20design%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=watch003&orientation=squarish",
    },
    {
      id: 4,
      name: "Tablets",
      productCount: 42,
      image:
        "https://readdy.ai/api/search-image?query=sleek%20tablet%20device%20with%20touchscreen%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=tablet004&orientation=squarish",
    },
    {
      id: 5,
      name: "Earphones",
      productCount: 68,
      image:
        "https://readdy.ai/api/search-image?query=wireless%20earphones%20earbuds%20with%20charging%20case%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=earphone005&orientation=squarish",
    },
    {
      id: 6,
      name: "Headphones",
      productCount: 45,
      image:
        "https://readdy.ai/api/search-image?query=premium%20over%20ear%20headphones%20with%20modern%20design%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=headphone006&orientation=squarish",
    },
    {
      id: 7,
      name: "Speakers",
      productCount: 34,
      image:
        "https://readdy.ai/api/search-image?query=bluetooth%20wireless%20speaker%20with%20sleek%20design%20on%20clean%20white%20background%20minimalist%20product%20photography%20professional%20lighting%20studio%20setup%20elegant%20technology%20device%20showcase&width=120&height=120&seq=speaker007&orientation=squarish",
    },
    {
      id: 8,
      name: "Chargers",
      productCount: 38,
      image:
        "https://nl.ugreen.com/cdn/shop/files/ugreen-nexode-draadloze-powerbank-10000-mah-magnetische-powerbank-met-usb-c-snellaadfunctie-draadloze-externe-batterij-magsafe-423996_300x300.png?v=1729827480",
    },
  ];

  const handleCategoryClick = (name) => {
    if (onCategorySelect) {
      onCategorySelect(name);
    }
    // Optionally navigate if you want
    // navigate(`/category/${name.toLowerCase()}`);
  };

  return (
    <div className="category-list container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Browse Categories</h5>
        <div>
          <button
            className="btn btn-link text-decoration-none me-2"
            onClick={() => navigate("/categories")}
          >
            View All →
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onCategorySelect(null)}
          >
            Show All
          </button>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 justify-content-start">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-item text-center border rounded p-3 position-relative"
            onClick={() => handleCategoryClick(cat.name)}
          >
            {user?.role === "admin" && (
              <FaTimesCircle
                size={16}
                color="red"
                className="position-absolute top-0 end-0 m-1"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevents category click
                  alert(`Delete category: ${cat.name}`);
                  // Later hook to backend
                }}
              />
            )}
            <img
              src={cat.image}
              alt={cat.name}
              width="50"
              height="50"
              className="rounded-circle mb-2"
            />
            <h6>{cat.name}</h6>
            <small className="text-muted">{cat.count} Products</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
