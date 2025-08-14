import http from './http';

export const register = async (payload) => {
  console.log(payload, 'Come here to registered?', process.env.NEXT_PUBLIC_BACKEND_API_URL, 'See the env');
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/register`, payload);
  return data;
};
export const verifyOTP = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-otp`, payload);
  return data;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/resend-otp`, payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`, payload);
  return data;
};

export const forgetPassword = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/forget-password`, payload);
  return data;
};

export const resetPassword = async ({ newPassword, token }) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/reset-password`, {
    newPassword: newPassword,
    token: token
  });
  return data;
};

export const adminDashboardAnalytics = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/dashboard-analytics`);
  return data;
};
export const getNotifications = async (page) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/notifications?limit=${page}`, {});
  return data;
};

export const getBrandsByAdmin = async (page, search) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/brands?search=${search}&page=${page}`
  );
  return data;
};
export const getBrandByAdmin = async (id) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/brands/${id}`);
  return data;
};
export const getAllBrandsByAdmin = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/all-brands`);
  return data;
};
export const addBrandByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/brands`, payload);
  return data;
};
export const updateBrandByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/brands/${currentSlug}`, payload);
  return data;
};
export const deleteBrandByAdmin = async (slug) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/brands/${slug}`);
  return data;
};

export const getCategoriesByAdmin = async (page, search) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/categories?search=${search}&page=${page}`
  );
  return data;
};
export const getCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/categories/${slug}`);
  return data;
};
export const deleteCategoryByAdmin = async (slug) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/categories/${slug}`);
  return data;
};
export const addCategoryByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/categories`, payload);
  return data;
};
export const updateCategoryByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/categories/${currentSlug}`,
    payload
  );
  return data;
};
export const getAllCategoriesByAdmin = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/all-categories`);
  return data;
};

export const getSubCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/subcategories/${slug}`);
  return data;
};
export const getSubCategoriesByAdmin = async (params) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/subcategories?${params}`);
  return data;
};
export const deleteSubCategoryByAdmin = async (slug) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/subcategories/${slug}`);
  return data;
};
export const addSubCategoryByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/subcategories`, payload);
  return data;
};
export const updateSubCategoryByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/subcategories/${currentSlug}`,
    payload
  );
  return data;
};

export const getProductsByAdmin = async (params) => {
  const { data: response } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/products?${params}`);
  return response;
};
export const createProductByAdmin = async (payload) => {
  const { data: response } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/products`, payload);
  return response;
};
export const updateProductByAdmin = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/products/${currentSlug}`,
    payload
  );
  return response;
};

export const deleteProductByAdmin = async (slug) => {
  const { data: response } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/products/${slug}`);
  return response;
};

export const getOrdersByAdmin = async (payload) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders?${payload}`);
  return data;
};
export const getOrderByAdmin = async (id) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${id}`);
  return data;
};
export const deleteOrderByAdmin = async (id) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${id}`);
  return data;
};
export const updateOrderStatus = async ({ id, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/orders/${id}`, payload);
  return data;
};
export const getUserByAdminsByAdmin = async (page, search) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users?search=${search}&page=${page}`
  );
  return response;
};
export const getUserByAdmin = async (id) => {
  const { data: response } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users/${id}`);
  return response;
};
export const updateUserRoleByAdmin = async (id) => {
  const { data: response } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/users/role/${id}`);
  return response;
};

export const getCouponCodesByAdmin = async (page, search) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupon-codes?search=${search}&page=${page}`
  );
  return response;
};

export const getCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupon-codes/${id}`);
  return response;
};

export const addCouponCodeByAdmin = async (payload) => {
  const { data: response } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupon-codes`, payload);
  return response;
};
export const updateCouponCodeByAdmin = async ({ currentId, ...others }) => {
  const { data: response } = await http.put(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupon-codes/${currentId}`,
    others
  );
  return response;
};
export const deleteCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/coupon-codes/${id}`);
  return response;
};

export const getNewsletter = async (page) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/newsletter?page=${page}`);
  return data;
};
export const getShopDetailsByAdmin = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops/${slug}`);
  return data;
};
export const addAdminShopByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops`, payload);
  return data;
};
export const updateAdminShopByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops/${currentSlug}`, payload);
  return data;
};
export const deleteShop = async (slug) => {
  const { data: response } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops/${slug}`);
  return response;
};
export const getLowStockProductsByAdmin = async (page) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/low-stock-products?page=${page}`
  );
  return response;
};
export const getShopsByAdmin = async (page, search) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops?search=${search}&page=${page}`
  );
  return response;
};
export const getShopIncomeByAdmin = async (slug, page) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/shops/${slug}/income?page=${page || 1}`
  );

  return data;
};
export const getIncomeDetailsByAdmin = async (pid, page) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/payments/${pid}?page=${page || 1}`);
  return data;
};
export const editPaymentByAdmin = async ({ pid, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/payments/${pid}`, { ...payload });
  return data;
};
export const createPaymentByAdmin = async ({ ...payload }) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/payments`, { ...payload });
  return data;
};
export const getPayoutsByAdmin = async (params) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/payouts?${params}`);
  return data;
};
export const getAllShopsByAdmin = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/all-shops`);
  return data;
};
export const getCurrenciesByAdmin = async (page, search) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/currencies?page=${page || 1}&search=${search || ''}`
  );
  return data;
};
export const addCurrencyByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/currencies`, payload);
  return data;
};
export const updateCurrencyByAdmin = async ({ _id, ...others }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/currencies/${_id}`, others);
  return data;
};
export const getCurrencyByAdmin = async (cid) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/currencies/${cid}`);
  return data;
};
export const getCompaignsByAdmin = async (page, search) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/compaigns?page=${page || 1}&search=${search || ''}`
  );
  return data;
};
export const addCompaignByAdmin = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/compaigns`, payload);
  return data;
};
export const updateCompaignByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/compaigns/${currentSlug}`, payload);
  return data;
};
export const getCompaignByAdmin = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/compaigns/${slug}`);
  return data;
};
export const deleteCompaignByAdmin = async (slug) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/compaigns/${slug}`);
  return data;
};

export const getVendorProductBySlug = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/products/${slug}`);
  return data;
};
export const getVendorShop = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/shop`);
  return data;
};
export const vendorDashboardAnalytics = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/dashboard-analytics`);
  return data;
};
export const getVendorLowStockProducts = async (page) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/low-stock-products?page=${page}`
  );
  return response;
};
export const getVendorProducts = async (page, search) => {
  const { data: response } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/products?search=${search}&page=${page}`
  );
  return response;
};
export const deleteVendorProduct = async (slug) => {
  const { data: response } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/products/${slug}`);
  return response;
};
export const createVendorProduct = async (payload) => {
  const { data: response } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/products`, payload);
  return response;
};
export const updateVendorProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/products/${currentSlug}`,
    payload
  );
  return response;
};
export const getOrdersByVendor = async (payload) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/orders?${payload}`);
  return data;
};
export const addShopByVendor = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/shops`, payload);
  return data;
};
export const updateShopByVendor = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/shops/${currentSlug}`, payload);
  return data;
};
export const getShopDetailsByVendor = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/shop/stats`);
  return data;
};
export const getIncomeByVendor = async (slug, page) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/vendor/shops/income?page=${page || 1}`);
  return data;
};

export const getProducts = async (query = '', cat, rate) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductDetails = async (pid) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/${pid}`);
  return data;
};

export const getProductsByCategory = async (query = '', category, rate) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category/products/${category}${query || '?'}&rate=${rate}`
  );
  return data;
};
export const getProductsByCompaign = async (query = '', slug, rate) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compaign/products/${slug}${query || '?'}&rate=${rate}`
  );
  return data;
};

export const getProductSlugs = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products-slugs`);
  return data;
};
export const getProductsBySubCategory = async (query = '', subcategory, rate) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subcategory/products/${subcategory}${query || '?'}&rate=${rate}`
  );
  return data;
};

export const getProductsByShop = async (query = '', shop, rate) => {
  const { data } = await http.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shop/products/${shop}${query || '?'}&rate=${rate}`
  );
  return data;
};

export const getAllProducts = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/all`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/filters`);
  return data;
};

export const getNewProducts = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/new`);
  return data;
};
export const getFiltersByShop = async (shop) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/filters/${shop}`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/new-arrivals`);
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/products/${slug}`);
  return data;
};

export const getProductReviews = async (pid) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reviews/${pid}`);
  return data;
};
export const addReview = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reviews`, payload);
  return data;
};

export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/invoice${page}`);
  return response;
};

export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/profile`, payload);
  return data;
};
export const changePassword = async ({ ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/change-password`, payload);
  return data;
};

export const getAddress = async (payload) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/addresses/${_id}`);
  return data;
};
export const search = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/search`, payload);
  return data;
};
export const getSearchFilters = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/search-filters`);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/invoice`);
  return data;
};
export const placeOrder = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/orders`, payload);
  return data;
};
export const getLayout = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/layout`);
  return data;
};
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/delete-file/${id}`);
  return data;
};

export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/newsletter`, payload);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist`);
  return data;
};
export const updateWishlist = async (pid) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/wishlist`, { pid });
  return data;
};
export const getCompareProducts = async (products) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compare/products`, { products });
  return data;
};

export const getProfile = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/profile`);
  return data;
};

export const getCart = async (ids) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cart`, {
    products: ids
  });
  return data;
};

export const getAllCategories = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/all-categories`);
  return data;
};
export const getHomeCategories = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/categories`);
  return data;
};

export const getHomeShops = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops?limit=5`);
  return data;
};
export const getHomeCompaigns = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compaigns`);
  return data;
};
export const getBestSellingProducts = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/products/best-selling`);
  return data;
};
export const getFeaturedProducts = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/products/featured`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/products/top`);
  return data;
};
export const getHomeBrands = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/home/brands`);
  return data;
};
export const getBrands = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/brands`);
  return data;
};
export const applyCouponCode = async (code) => {
  const { data: response } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupon-codes/${code}`);
  return response;
};

export const paymentIntents = async (amount, currency) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/payment-intents`, {
    amount,
    currency
  });
  return data;
};

export const addShopByUser = async (payload) => {
  const { data } = await http.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops`, {
    ...payload
  });

  return data;
};
export const getShopByUser = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/user/shop`);
  return data;
};

export const getShops = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops`);
  return data;
};
export const getAllCategoriesByUser = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/all-categories`);
  return data;
};

export const getCurrencies = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/currencies`);
  return data;
};
export const getCategoryTitle = async (category) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/category-title/${category}`);
  return data;
};

export const getCategoryBySlug = async (category) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories/${category}`);
  return data;
};

export const getCategorySlugs = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories-slugs`);
  return data;
};
export const getShopSlugs = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops-slugs`);
  return data;
};
export const getShopBySlug = async (shop) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops/${shop}`);
  return data;
};
export const getShopTitle = async (shop) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shop-title/${shop}`);
  return data;
};

export const getSubCategoryTitle = async (subcategory) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subcategory-title/${subcategory}`);
  return data;
};
export const getSubCategoryBySlug = async (subcategory) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subcategories/${subcategory}`);
  return data;
};

export const getSubCategorySlugs = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/subcategories-slugs`);
  return data;
};

export const getCompaignSlugs = async () => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compaigns-slugs`);
  return data;
};
export const getCompaignBySlug = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compaigns/${slug}`);
  return data;
};
export const getCompaignTitle = async (slug) => {
  const { data } = await http.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/compaign-title/${slug}`);
  return data;
};

export const followShop = async (shopId) => {
  const { data } = await http.put(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/shops/${shopId}/follow`);
  return data;
};
// export const contactUs = async (payload) => {
//   const { data } = await http.post(`/contact-us`, payload);
//   return data;
// };
