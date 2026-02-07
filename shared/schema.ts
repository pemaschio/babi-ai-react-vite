import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// TABELAS
// ============================================

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email").unique().notNull(),
    fullName: text("full_name"),
    company: text("company"),
    role: text("role"),
    phone: text("phone"),
    whatsappNumber: text("whatsapp_number").unique(),
    onboardingCompleted: boolean("onboarding_completed").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_profiles_email").on(table.email)]
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id),
    whatsappNumber: text("whatsapp_number").notNull(),
    status: text("status").default("active"),
    context: jsonb("context").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_conversations_user_id").on(table.userId),
    index("idx_conversations_whatsapp").on(table.whatsappNumber),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => conversations.id),
    direction: text("direction").notNull(),
    content: text("content").notNull(),
    messageType: text("message_type").default("text"),
    metadata: jsonb("metadata").default({}),
    processedBy: text("processed_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_messages_conversation_id").on(table.conversationId),
    index("idx_messages_created_at").on(table.createdAt),
  ]
);

export const roleplaySessions = pgTable(
  "roleplay_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id),
    scenario: text("scenario").notNull(),
    methodology: text("methodology"),
    status: text("status").default("active"),
    audioFiles: text("audio_files").array(),
    feedback: jsonb("feedback").default({}),
    score: integer("score"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [index("idx_roleplay_user_id").on(table.userId)]
);

export const knowledgeBase = pgTable("knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const userAnalytics = pgTable(
  "user_analytics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => profiles.id),
    metricName: text("metric_name").notNull(),
    metricValue: numeric("metric_value").notNull(),
    metadata: jsonb("metadata").default({}),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_analytics_user_metric").on(table.userId, table.metricName),
  ]
);

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ============================================
// SCHEMAS ZOD
// ============================================

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertConversationSchema = createInsertSchema(conversations);
export const selectConversationSchema = createSelectSchema(conversations);

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export const insertRoleplaySchema = createInsertSchema(roleplaySessions);
export const selectRoleplaySchema = createSelectSchema(roleplaySessions);

export const insertKnowledgeSchema = createInsertSchema(knowledgeBase);
export const selectKnowledgeSchema = createSelectSchema(knowledgeBase);

export const insertAnalyticsSchema = createInsertSchema(userAnalytics);
export const selectAnalyticsSchema = createSelectSchema(userAnalytics);

export const insertSettingsSchema = createInsertSchema(systemSettings);
export const selectSettingsSchema = createSelectSchema(systemSettings);

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export type Profile = z.infer<typeof selectProfileSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Conversation = z.infer<typeof selectConversationSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = z.infer<typeof selectMessageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type RoleplaySession = z.infer<typeof selectRoleplaySchema>;
export type InsertRoleplaySession = z.infer<typeof insertRoleplaySchema>;

export type KnowledgeItem = z.infer<typeof selectKnowledgeSchema>;
export type InsertKnowledgeItem = z.infer<typeof insertKnowledgeSchema>;

export type UserAnalytic = z.infer<typeof selectAnalyticsSchema>;
export type InsertUserAnalytic = z.infer<typeof insertAnalyticsSchema>;

export type SystemSetting = z.infer<typeof selectSettingsSchema>;
export type InsertSystemSetting = z.infer<typeof insertSettingsSchema>;
