import Product from '../models/Product.model'

export const seedDB = async (): Promise<void> => {
  const count = await Product.countDocuments()
  if (count > 0) return

  console.log('Seeding database...')

  const userId = '000000000000000000000001'

  await Product.insertMany([
    { name: 'Classic White Tee', type: 'crew neck', gender: 'unisex', colour: 'white', price: 499, quantity: 20, imageUrl: '/uploads/classic-white-tee.jpg', addedBy: userId },
    { name: 'Midnight Polo', type: 'polo', gender: 'male', colour: 'black', price: 799, quantity: 15, imageUrl: '/uploads/midnight-polo.jpg', addedBy: userId },
    { name: 'Rose Oversized Tee', type: 'oversized', gender: 'female', colour: 'pink', price: 649, quantity: 10, imageUrl: '/uploads/rose-oversized.jpg', addedBy: userId },
    { name: 'Navy Henley', type: 'henley', gender: 'male', colour: 'navy', price: 599, quantity: 12, imageUrl: '/uploads/navy-henley.jpg', addedBy: userId },
    { name: 'Forest Polo', type: 'polo', gender: 'unisex', colour: 'green', price: 749, quantity: 8, imageUrl: '/uploads/forest-polo.jpg', addedBy: userId },
    { name: 'Cream Crop Tee', type: 'crop', gender: 'female', colour: 'cream', price: 549, quantity: 18, imageUrl: '/uploads/cream-crop.jpg', addedBy: userId },
    { name: 'Graphite V-Neck', type: 'v-neck', gender: 'male', colour: 'grey', price: 499, quantity: 25, imageUrl: '/uploads/graphite-vneck.jpg', addedBy: userId },
    { name: 'Rust Oversized', type: 'oversized', gender: 'unisex', colour: 'orange', price: 699, quantity: 6, imageUrl: '/uploads/rust-oversized.jpg', addedBy: userId },
    { name: 'Sky Blue Polo', type: 'polo', gender: 'male', colour: 'blue', price: 799, quantity: 14, imageUrl: '/uploads/sky-blue-polo.jpg', addedBy: userId },
    { name: 'Charcoal Crew', type: 'crew neck', gender: 'female', colour: 'grey', price: 449, quantity: 20, imageUrl: '/uploads/charcoal-crew.jpg', addedBy: userId },
    { name: 'Olive Henley', type: 'henley', gender: 'unisex', colour: 'green', price: 629, quantity: 9, imageUrl: '/uploads/olive-henley.jpg', addedBy: userId },
    { name: 'Blush Crop Tee', type: 'crop', gender: 'female', colour: 'pink', price: 499, quantity: 11, imageUrl: '/uploads/blush-crop.jpg', addedBy: userId },
  ])

  console.log('Seeding complete.')
}
