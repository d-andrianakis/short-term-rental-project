import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  real,
  varchar,
  numeric
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});


/**
   @todo: split settings into multiple tables
**/
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

/**
   @todo: split properties into multiple tables. One will contain basic info and the other will contain detailed info.
**/

export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  city: text("city").notNull()
});

export const property = pgTable("property", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
  status: boolean(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  mainImage: text("main_image"),
  pricePerNight: numeric("price_per_night", { precision: 10, scale: 2 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  amount: real("amount").notNull(),
  country: varchar("country").notNull()
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  review: text("review"),
  easeOfAccess: integer("ease_of_access").notNull(),
  valueForMoney: integer("value_for_money").notNull(),
  communication: integer("communication").notNull()
});

export const propery_attributes = pgTable("property_attributes", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  filterType: varchar("filter_type"),
  filterable: boolean(),
  text: varchar("text"),
  value: varchar("value"),
  applicable_countries: varchar("applicable_countries")
});

 export const property_reviews = pgTable("property_reviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "property_reviews_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
  propertyId: integer("property_id").notNull(),
  overallScore: numeric("overall_score", { precision: 2, scale:  0 }),
  review: text(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  settings,
  properties,
  property,
  bookings,
  reviews,
  propery_attributes,
  property_reviews
};