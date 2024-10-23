// Routes
import categoryRoute from "./categoryRoute.js";
import brandRoute from "./brandRoute.js";
import subCategoryRoute from './subCategoryRoute.js';
import productRoute from "./productRoute.js";
import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";
import reviewRoute from "./reviewRoute.js";
import wishlistRoute from "./wishistRoute.js";
import adressRoute from './addressRoute.js';
import couponRoute from "./couponRoute.js";
import cartRoute from "./cartRoute.js"
import orderRoute from "./orderRoute.js";

export const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/categories", categoryRoute);
  app.use("/api/brands", brandRoute);
  app.use("/api/subcCategories", subCategoryRoute);
  app.use("/api/products", productRoute);
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/reviews", reviewRoute);
  app.use("/api/add-to-wishlist", wishlistRoute);
  app.use("/api/addresses", adressRoute);
  app.use("/api/coupons", couponRoute);
  app.use("/api/cart", cartRoute);
  app.use("/api/orders", orderRoute);


}

