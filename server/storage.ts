import { eq, desc } from "drizzle-orm";
import { db } from "./db.js";
import {
  profiles,
  conversations,
  messages,
  roleplaySessions,
  knowledgeBase,
  userAnalytics,
  systemSettings,
  type InsertProfile,
  type InsertConversation,
  type InsertMessage,
  type InsertRoleplaySession,
  type InsertKnowledgeItem,
  type InsertUserAnalytic,
  type InsertSystemSetting,
} from "../shared/schema.js";

export const storage = {
  // Profiles
  async getProfile(userId: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId));
    return profile ?? null;
  },

  async upsertProfile(data: InsertProfile) {
    const [profile] = await db
      .insert(profiles)
      .values(data)
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          fullName: data.fullName,
          company: data.company,
          role: data.role,
          phone: data.phone,
          whatsappNumber: data.whatsappNumber,
          onboardingCompleted: data.onboardingCompleted,
          updatedAt: new Date(),
        },
      })
      .returning();
    return profile;
  },

  // Conversations
  async getConversations(userId: string) {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  },

  async getConversationsByPhone(phone: string) {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.whatsappNumber, phone))
      .orderBy(desc(conversations.updatedAt));
  },

  async getConversation(id: string) {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation ?? null;
  },

  async createConversation(data: InsertConversation) {
    const [conversation] = await db
      .insert(conversations)
      .values(data)
      .returning();
    return conversation;
  },

  // Messages
  async getMessages(conversationId: string) {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  },

  async createMessage(data: InsertMessage) {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  },

  // Role Play
  async getRoleplays(userId: string) {
    return db
      .select()
      .from(roleplaySessions)
      .where(eq(roleplaySessions.userId, userId))
      .orderBy(desc(roleplaySessions.createdAt));
  },

  async getRoleplay(id: string) {
    const [session] = await db
      .select()
      .from(roleplaySessions)
      .where(eq(roleplaySessions.id, id));
    return session ?? null;
  },

  async createRoleplay(data: InsertRoleplaySession) {
    const [session] = await db
      .insert(roleplaySessions)
      .values(data)
      .returning();
    return session;
  },

  async updateRoleplay(
    id: string,
    data: Partial<InsertRoleplaySession>
  ) {
    const [session] = await db
      .update(roleplaySessions)
      .set(data)
      .where(eq(roleplaySessions.id, id))
      .returning();
    return session;
  },

  // Knowledge Base
  async getKnowledge(userId?: string) {
    if (userId) {
      return db
        .select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.userId, userId));
    }
    return db
      .select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.isPublic, true));
  },

  async createKnowledge(data: InsertKnowledgeItem) {
    const [item] = await db.insert(knowledgeBase).values(data).returning();
    return item;
  },

  // Analytics
  async getAnalytics(userId: string) {
    return db
      .select()
      .from(userAnalytics)
      .where(eq(userAnalytics.userId, userId))
      .orderBy(desc(userAnalytics.recordedAt));
  },

  async createAnalytic(data: InsertUserAnalytic) {
    const [analytic] = await db
      .insert(userAnalytics)
      .values(data)
      .returning();
    return analytic;
  },

  // Settings
  async getSetting(key: string) {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key));
    return setting ?? null;
  },

  async getAllSettings() {
    return db.select().from(systemSettings);
  },

  async upsertSetting(data: InsertSystemSetting) {
    const [setting] = await db
      .insert(systemSettings)
      .values(data)
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: data.value, updatedAt: new Date() },
      })
      .returning();
    return setting;
  },
};
