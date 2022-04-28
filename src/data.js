const products = [
  // utama
  { productName: 'Burger', image_url: 'images/food_eduwork/burger-eduwork.png', category: 'utama', tag: ['burger', 'heavy', 'savoury'], price: 'Rp. 15.000', quantity: 50},
  { productName: 'Mini Burger', image_url: 'images/food_eduwork/miniBurger-eduwork.png', category: 'utama', tag: ['burger', 'light', 'savoury'], price: 'Rp. 5.000', quantity: 50},
  { productName: 'Burger Package', image_url: 'images/food_eduwork/burgerPackage-eduwork.jpg', category: 'utama', tag: ['burger', 'heavy', 'savoury'], price: 'Rp. 50.000', quantity: 25},
  { productName: 'Burger Extra', image_url: 'images/food_eduwork/burgerExtra-eduwork.png', category: 'utama', tag: ['burger', 'heavy', 'savoury'], price: 'Rp. 20.000', quantity: 30},
  { productName: 'Fried Chiken', image_url: 'images/food_eduwork/friedChiken-eduwork.png', category: 'utama', tag: ['chicken', 'heavy', 'savoury'], price: 'Rp. 10.000', quantity: 60},
  { productName: 'Grilled Chiken', image_url: 'images/food_eduwork/grilledChiken-eduwork.png', category: 'utama', tag: ['chicken', 'heavy', 'savoury'], price: 'Rp. 9.000', quantity: 45},
  // minuman
  { productName: 'Tea', image_url: 'images/food_eduwork/tea-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 3.000', quantity: 80},
  { productName: 'Black Coffee', image_url: 'images/food_eduwork/blackCoffee-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 4.000', quantity: 100},
  { productName: 'Coconut Water', image_url: 'images/food_eduwork/coconut-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 15.000', quantity: 50},
  { productName: 'Milk', image_url: 'images/food_eduwork/milk-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 7.000', quantity: 70},
  { productName: 'Apple Juice', image_url: 'images/food_eduwork/appleJuice-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 8.000', quantity: 60},
  { productName: 'Avocado Juice', image_url: 'images/food_eduwork/avocadoJuice-eduwork.png', category: 'minuman', tag: ['drink', 'light', 'sweet'], price: 'Rp. 9.000', quantity: 55},
  // snack
  { productName: 'Roasted Peanuts', image_url: 'images/food_eduwork/roastedPeanuts-eduwork.png', category: 'snack', tag: ['light', 'savoury'], price: 'Rp. 3.000', quantity: 99},
  { productName: 'French Fries', image_url: 'images/food_eduwork/frenchFries-eduwork.png', category: 'snack', tag: ['light', 'savoury'], price: 'Rp. 5.000', quantity: 54},
  { productName: 'Fried Banana', image_url: 'images/food_eduwork/friedBanana-eduwork.png', category: 'snack', tag: ['light', 'sweet'], price: 'Rp. 2.000', quantity: 62},
  { productName: 'Ice Cream', image_url: 'images/food_eduwork/icecream-eduwork.png', category: 'snack', tag: ['light', 'sweet'], price: 'Rp. 8.000', quantity: 71},
  // pastry
  { productName: 'Puff Pastry', image_url: 'images/food_eduwork/puffPastry-eduwork.png', category: 'pastry', tag: ['light', 'sweet'], price: 'Rp. 8.000', quantity: 30},
  { productName: 'Sliced Bread', image_url: 'images/food_eduwork/slicedBread-eduwork.png', category: 'pastry', tag: ['light', 'sweet'], price: 'Rp. 5.000', quantity: 40},
  { productName: 'Garlic Bread', image_url: 'images/food_eduwork/garlicBread-eduwork.png', category: 'pastry', tag: ['light', 'sweet'], price: 'Rp. 7.000', quantity: 25},
  { productName: 'Chocolate Cake', image_url: 'images/food_eduwork/chocolateCake-eduwork.png', category: 'pastry', tag: ['light', 'sweet'], price: 'Rp. 15.000', quantity: 15},
]

const categories = [{name: 'utama'}, {name: 'minuman'}, {name: 'snack'}, {name: 'pastry'}]

const tags = [
  { name: 'heavy' },
  { name: 'light' },
  { name: 'savoury' },
  { name: 'sweet' },
  { name: 'drink' },
  { name: 'burger' },
  { name: 'chicken' },
]

export default products
export {
  categories,
  tags
}