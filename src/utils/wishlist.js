export const getWishlist = () =>
  JSON.parse(localStorage.getItem("wishlist")) || [];

export const toggleWishlist = (product) => {
  let wishlist = getWishlist();
  const exists = wishlist.find((item) => item.id === product.id);

  if (exists) {
    wishlist = wishlist.filter((item) => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};
