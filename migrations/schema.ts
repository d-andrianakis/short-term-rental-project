import { pgTable, text, timestamp, foreignKey, unique, boolean, serial, integer, real, varchar, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	role: text(),
	banned: boolean(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
	impersonatedBy: text("impersonated_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	fileName: text("file_name").notNull(),
	originalName: text("original_name").notNull(),
	filePath: text("file_path").notNull(),
	fileSize: integer("file_size").notNull(),
	mimeType: text("mime_type").notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow().notNull(),
	key: text().notNull(),
});

export const bookings = pgTable("bookings", {
	id: serial().primaryKey().notNull(),
	propertyId: integer("property_id").notNull(),
	start: timestamp({ mode: 'string' }).notNull(),
	end: timestamp({ mode: 'string' }).notNull(),
	amount: real().notNull(),
	country: varchar().notNull(),
});

export const reviews = pgTable("reviews", {
	id: serial().primaryKey().notNull(),
	propertyId: integer("property_id").notNull(),
	review: text(),
	easeOfAccess: integer("ease_of_access").notNull(),
	valueForMoney: integer("value_for_money").notNull(),
	communication: integer().notNull(),
});

export const property = pgTable("property", {
	name: text().notNull(),
	slug: text(),
	status: boolean(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	propertyId: integer("property_id"),
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "property_id_temp_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	mainImage: text("main_image"),
}, (table) => [
	unique("property_id_key").on(table.id),
]);

export const propertyAttributes = pgTable("property_attributes", {
	id: serial().primaryKey().notNull(),
	propertyId: integer("property_id").notNull(),
	filterable: boolean(),
	text: varchar(),
	applicableCountries: varchar("applicable_countries"),
	value: varchar(),
	filterType: varchar("filter_type"),
});

export const properties = pgTable("properties", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "properties_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	city: text(),
});

export const propertyReviews = pgTable("property_reviews", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "property_reviews_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	propertyId: integer("property_id").notNull(),
	overallScore: numeric("overall_score", { precision: 2, scale:  0 }),
	review: text(),
});
