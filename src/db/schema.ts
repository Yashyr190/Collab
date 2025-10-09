import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  skills: text('skills', { mode: 'json' }),
  xp: integer('xp').default(0),
  badges: text('badges', { mode: 'json' }),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at').notNull(),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  tags: text('tags', { mode: 'json' }),
  type: text('type').notNull(),
  status: text('status').notNull().default('open'),
  createdAt: text('created_at').notNull(),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  conversationId: text('conversation_id').notNull(),
  text: text('text').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  timestamp: text('timestamp').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: integer('is_read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  members: text('members', { mode: 'json' }),
  tasks: text('tasks', { mode: 'json' }),
  status: text('status').notNull().default('planning'),
  progress: integer('progress').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const progress = sqliteTable('progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  milestones: text('milestones', { mode: 'json' }),
  percentageCompleted: integer('percentage_completed').default(0),
  lastActivity: text('last_activity'),
  updatedAt: text('updated_at').notNull(),
});

export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  authorId: integer('author_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  tags: text('tags', { mode: 'json' }),
  upvotes: integer('upvotes').default(0),
  createdAt: text('created_at').notNull(),
});

export const endorsements = sqliteTable('endorsements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  endorsedBy: integer('endorsed_by').references(() => users.id).notNull(),
  skill: text('skill').notNull(),
  createdAt: text('created_at').notNull(),
});