import React from 'react';

// Enhanced menu data with prices and descriptions
const fullMenu = {
  'Chinese Cuisine': [
    { name: 'Fried Rice', price: '$2.85', description: 'Classic stir-fried rice with vegetables and your choice of protein.' },
    { name: 'Chow Mein', price: '$3.18', description: 'Stir-fried noodles with crisp vegetables and savory sauce.' },
    { name: 'Kung Pao Chicken', price: '$4.78', description: 'Spicy, stir-fried chicken dish with peanuts, vegetables, and chili peppers.' },
    { name: 'Sweet and Sour Pork', price: '$4.44', description: 'Crispy pork pieces tossed in a tangy sweet and sour sauce.' },
    { name: 'Orange Chicken', price: '$5.12', description: 'Deep-fried chicken coated in a sweet, citrusy, and spicy orange sauce.' },
    { name: 'General Tso\'s Chicken', price: '$5.35', description: 'Sweet and spicy deep-fried chicken dish, a popular American Chinese cuisine.' },
    { name: 'Dim Sum (Assorted)', price: '$3.41', description: 'A selection of traditional bite-sized Chinese dishes, perfect for sharing.' },
    { name: 'Dumplings (Steamed/Fried)', price: '$3.30', description: 'Savory fillings encased in delicate wrappers, served steamed or pan-fried.' },
    { name: 'Spring Roll (Veg/Non-Veg)', price: '$2.05', description: 'Crispy rolls filled with fresh vegetables or meat, served with dipping sauce.' },
    { name: 'Wonton Soup', price: '$2.50', description: 'Clear broth with delicate wontons filled with seasoned meat or vegetables.' },
    { name: 'Hot Pot (Per Person)', price: '$6.83', description: 'A simmering pot of soup stock at the table, with various ingredients to cook.' },
    { name: 'Mapo Tofu', price: '$3.98', description: 'Spicy and aromatic Sichuan dish with tofu and minced meat in a chili bean sauce.' },
    { name: 'Beef with Broccoli', price: '$5.92', description: 'Tender beef slices stir-fried with fresh broccoli florets in a savory sauce.' }
  ],
  'Italian Cuisine': [
    { name: 'Pasta (Choice of Sauce)', price: '$4.32', description: 'Your choice of pasta with marinara, pesto, or creamy alfredo sauce.' },
    { name: 'Spaghetti Bolognese', price: '$5.12', description: 'Classic Italian meat sauce served over spaghetti.' },
    { name: 'Carbonara', price: '$5.47', description: 'Creamy pasta dish with eggs, hard cheese, cured pork, and black pepper.' },
    { name: 'Fettuccine Alfredo', price: '$5.24', description: 'Rich and creamy pasta dish with butter, Parmesan cheese, and heavy cream.' },
    { name: 'Penne Arrabbiata', price: '$4.44', description: 'Spicy tomato sauce with garlic and red chili peppers, served with penne pasta.' },
    { name: 'Lasagna (Veg/Non-Veg)', price: '$6.26', description: 'Layers of pasta, rich sauce, and cheese, baked to perfection.' },
    { name: 'Mushroom Risotto', price: '$5.69', description: 'Creamy Arborio rice cooked with mushrooms, broth, and Parmesan cheese.' },
    { name: 'Potato Gnocchi', price: '$5.58', description: 'Soft potato dumplings served with your choice of sauce.' },
    { name: 'Ravioli (Spinach & Ricotta)', price: '$5.92', description: 'Pasta pockets filled with spinach and ricotta, served with a light tomato sauce.' },
    { name: 'Bruschetta al Pomodoro', price: '$2.39', description: 'Toasted bread rubbed with garlic and topped with tomatoes, basil, and olive oil.' },
    { name: 'Caprese Salad', price: '$3.64', description: 'Simple Italian salad with fresh mozzarella, tomatoes, and basil, seasoned with olive oil.' },
    { name: 'Tiramisu', price: '$3.18', description: 'Classic Italian coffee-flavored dessert with ladyfingers, coffee, mascarpone cheese, and cocoa.' }
  ],
  'Main Courses – Meat & Poultry': [
    { name: 'Roasted Chicken', price: '$6.60', description: 'Succulent roasted chicken, seasoned to perfection.' },
    { name: 'Grilled Chicken Breast', price: '$6.26', description: 'Tender grilled chicken breast, served with seasonal vegetables.' },
    { name: 'Chicken Parmesan', price: '$7.05', description: 'Breaded chicken cutlet, topped with tomato sauce and mozzarella, baked.' },
    { name: 'Grilled Steak (Sirloin)', price: '$9.67', description: 'Juicy sirloin steak, grilled to your preference, served with sides.' },
    { name: 'Ribeye Steak', price: '$13.66', description: 'Premium ribeye steak, perfectly seared for maximum flavor.' },
    { name: 'Beef Stroganoff', price: '$7.97', description: 'Sautéed pieces of beef served in a sour cream sauce, over noodles or rice.' },
    { name: 'Pork Chops with Apple Sauce', price: '$7.74', description: 'Tender pork chops, pan-seared and served with a sweet apple sauce.' },
    { name: 'Lamb Shank', price: '$10.82', description: 'Slow-cooked lamb shank, falling off the bone, in a rich gravy.' },
    { name: 'Grilled Salmon', price: '$8.53', description: 'Perfectly grilled salmon fillet, rich in omega-3s, served with lemon.' },
    { name: 'Fish and Chips', price: '$6.71', description: 'Crispy battered fish served with golden French fries.' },
    { name: 'Mixed Seafood Platter', price: '$17.07', description: 'A generous assortment of grilled and fried seafood delights.' },
    { name: 'Garlic Butter Shrimp', price: '$7.74', description: 'Plump shrimp sautéed in aromatic garlic butter sauce.' },
    { name: 'Lobster Thermidor', price: '$28.45', description: 'Creamy mixture of cooked lobster meat, egg yolks, and brandy, stuffed into a lobster shell.' }
  ],
  'Vegetarian Main Courses': [
    { name: 'Garden Fresh Salad', price: '$3.41', description: 'A vibrant mix of seasonal greens and fresh vegetables with a light dressing.' },
    { name: 'Caesar Salad', price: '$3.98', description: 'Crisp romaine lettuce, croutons, Parmesan cheese, and creamy Caesar dressing.' },
    { name: 'Greek Salad', price: '$3.64', description: 'Fresh tomatoes, cucumbers, bell peppers, red onion, feta cheese, and olives.' },
    { name: 'Quinoa Bowl (Mediterranean)', price: '$4.55', description: 'Healthy quinoa bowl with roasted vegetables, chickpeas, and a lemon-tahini dressing.' },
    { name: 'Classic Veggie Burger', price: '$4.32', description: 'Hearty plant-based patty served on a bun with fresh toppings and fries.' }
  ],
  'Appetizers & Sides': [
    { name: 'Loaded Nachos', price: '$3.30', description: 'Crispy tortilla chips piled high with cheese, jalapeños, salsa, and sour cream.' },
    { name: 'Chicken Wings (BBQ/Spicy)', price: '$3.98', description: 'Crispy chicken wings tossed in your choice of BBQ or spicy buffalo sauce.' },
    { name: 'French Fries', price: '$1.71', description: 'Golden, crispy, and perfectly salted French fries.' },
    { name: 'Onion Rings', price: '$2.05', description: 'Crispy, battered onion rings, a perfect side or appetizer.' },
    { name: 'Garlic Bread with Cheese', price: '$2.28', description: 'Toasted bread smothered in garlic butter and melted mozzarella cheese.' }
  ],
  'Desserts': [
    { name: 'New York Cheesecake', price: '$3.64', description: 'Rich, creamy, and classic New York-style cheesecake.' },
    { name: 'Molten Chocolate Cake', price: '$3.41', description: 'Warm chocolate cake with a gooey, molten chocolate center, served with ice cream.' },
    { name: 'Assorted Ice Cream (Per Scoop)', price: '$1.71', description: 'Your choice of delicious ice cream flavors.' }
  ],
  'Beverages': [
    { name: 'Coffee (Espresso/Latte/Cappuccino)', price: '$2.05', description: 'A selection of freshly brewed coffees to kickstart your day or wind down.' },
    { name: 'Tea (Assorted Flavors)', price: '$1.37', description: 'Various tea selections, from classic black tea to soothing herbal infusions.' },
    { name: 'Fresh Juice (Orange/Apple)', price: '$2.28', description: 'Refreshing and healthy fresh juices to quench your thirst.' },
  ]
};

const MenuPage = () => {
  const categories = Object.entries(fullMenu);
  // Calculate the split point for two columns
  const halfwayPoint = Math.ceil(categories.length / 2);

  const firstColumnCategories = categories.slice(0, halfwayPoint);
  const secondColumnCategories = categories.slice(halfwayPoint);

  return (
    <div className="menu-page-wrapper">
      {/* Inline styles for the menu page, mimicking the HTML Canvas */}
      <style>{`
        body { /* Ensure body has Inter font */
            font-family: 'Inter', sans-serif;
        }
        .menu-page-wrapper {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* Light gray background */
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Align to top for better viewing of long content */
            min-height: 100vh;
            padding: 2rem;
            width: 100%; /* Ensure wrapper takes full width */
        }
        .menu-card {
            background-color: #ffffff;
            border-radius: 1rem; /* Rounded corners for the card */
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            max-width: 900px; /* Increased max width for two columns */
            width: 100%;
            padding: 2.5rem;
            border: 2px solid #fbd38d; /* Subtle border color inspired by the image */
            position: relative;
            overflow: hidden; /* Ensure no overflow */
            display: flex; /* Use flex to contain header and columns */
            flex-direction: column; /* Stack header above columns */
        }
        .menu-header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px dashed #fbd38d; /* Dashed line separator */
        }
        .menu-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 0.5rem;
        }
        .menu-header p {
            font-size: 1.125rem;
            color: #666;
        }
        .menu-columns {
            display: grid;
            grid-template-columns: 1fr; /* Default to single column on small screens */
            gap: 2rem; /* Gap between columns */
            width: 100%;
        }
        @media (min-width: 768px) { /* Two columns on medium screens and up */
            .menu-columns {
                grid-template-columns: 1fr 1fr;
            }
        }
        .menu-category {
            margin-bottom: 2rem;
        }
        .menu-category:last-child {
            margin-bottom: 0; /* No bottom margin for the last category in a column */
        }
        .menu-category-title {
            font-size: 1.75rem;
            font-weight: 600;
            color: #4a5568; /* Darker gray for category titles */
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0; /* Light border for categories */
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .menu-item {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 0.75rem 0;
            border-bottom: 1px dotted #cbd5e0; /* Dotted line for items */
        }
        .menu-item:last-child {
            border-bottom: none; /* No border for the last item in a category */
        }
        .menu-item-name {
            font-size: 1.1rem;
            font-weight: 500;
            color: #2d3748; /* Slightly darker text for item names */
            flex-grow: 1;
        }
        .menu-item-price {
            font-size: 1.1rem;
            font-weight: 600;
            color: #e53e3e; /* Red for prices */
            margin-left: 1rem;
            white-space: nowrap; /* Prevent price from wrapping */
        }
        /* Custom styling for the decorative borders, similar to the image */
        .decorative-border-left, .decorative-border-right {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 15px; /* Adjust width as needed */
            background-color: #fbd38d; /* Golden/orange color */
            border-radius: 0.5rem;
            z-index: 1; /* Ensure borders are above content if needed */
        }
        .decorative-border-left {
            left: 0;
            transform: translateX(-50%);
        }
        .decorative-border-right {
            right: 0;
            transform: translateX(50%);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .menu-card {
                padding: 1.5rem;
            }
            .menu-header h1 {
                font-size: 2rem;
            }
            .menu-category-title {
                font-size: 1.5rem;
            }
            .menu-item-name, .menu-item-price {
                font-size: 1rem;
            }
            .decorative-border-left, .decorative-border-right {
                width: 10px; /* Smaller borders on mobile */
            }
        }
      `}</style>
      <div className="menu-card">
        {/* Decorative borders */}
        <div className="decorative-border-left"></div>
        <div className="decorative-border-right"></div>

        <div className="menu-header">
          <h1>RAJAMAHAL</h1>
          <p>Experience Culinary Excellence</p>
        </div>

        <div className="menu-columns">
          {/* First Column */}
          <div>
            {firstColumnCategories.map(([category, items], categoryIndex) => (
              <div key={categoryIndex} className="menu-category">
                <h2 className="menu-category-title">
                  {/* Emojis based on category name */}
                  {category.includes('Chinese') && <span className="text-xl">🥢</span>}
                  {category.includes('Italian') && <span className="text-xl">🍝</span>}
                  {category.includes('Meat') && <span className="text-xl">🍖</span>}
                  {category.includes('Vegetarian') && <span className="text-xl">🥗</span>}
                  {category.includes('Appetizers') && <span className="text-xl">🍟</span>}
                  {category.includes('Desserts') && <span className="text-xl">🍰</span>}
                  {category.includes('Beverages') && <span className="text-xl">☕</span>}
                  {category}
                </h2>
                {items.map((item, itemIndex) => (
                  <div key={itemIndex} className="menu-item">
                    <span className="menu-item-name">{item.name}</span>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Second Column */}
          <div>
            {secondColumnCategories.map(([category, items], categoryIndex) => (
              <div key={categoryIndex} className="menu-category">
                <h2 className="menu-category-title">
                  {/* Emojis based on category name */}
                  {category.includes('Chinese') && <span className="text-xl">🥢</span>}
                  {category.includes('Italian') && <span className="text-xl">🍝</span>}
                  {category.includes('Meat') && <span className="text-xl">🍖</span>}
                  {category.includes('Vegetarian') && <span className="text-xl">🥗</span>}
                  {category.includes('Appetizers') && <span className="text-xl">🍟</span>}
                  {category.includes('Desserts') && <span className="text-xl">🍰</span>}
                  {category.includes('Beverages') && <span className="text-xl">☕</span>}
                  {category}
                </h2>
                {items.map((item, itemIndex) => (
                  <div key={itemIndex} className="menu-item">
                    <span className="menu-item-name">{item.name}</span>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
