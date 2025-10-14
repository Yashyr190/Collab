import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
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
  role: text('role').default('user'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Posts table
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  tags: text('tags', { mode: 'json' }),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Projects table
export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  members: text('members', { mode: 'json' }),
  tasks: text('tasks', { mode: 'json' }),
  activities: text('activities', { mode: 'json' }),
  status: text('status').notNull(),
  progress: integer('progress').default(0),
  average_rating: real('average_rating').default(0),
  total_ratings: integer('total_ratings').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Messages table
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

// Notifications table
export const notifications = sqliteTable('notifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

// Resources table
export const resources = sqliteTable('resources', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  url: text('url').notNull(),
  upvotes: integer('upvotes').default(0),
  createdBy: integer('created_by').references(() => users.id).notNull(),
  createdAt: text('created_at').notNull(),
});

// Applications table
export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  message: text('message'),
  status: text('status').default('pending'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Endorsements table
export const endorsements = sqliteTable('endorsements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  endorsedBy: integer('endorsed_by').references(() => users.id).notNull(),
  skill: text('skill').notNull(),
  createdAt: text('created_at').notNull(),
});

// Add new project_ratings table
export const projectRatings = sqliteTable('project_ratings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  createdAt: text('created_at').notNull(),
});