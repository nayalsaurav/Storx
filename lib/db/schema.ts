import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  //basic file/folder info
  name: text("name").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(), // folder

  //storage information
  fileUrl: text("file_url").notNull(), // url to access file
  thumbnailUrl: text("thumbnail_url"),
  imagekitFileId: text("imagekit_file_id"),

  //ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), // parent folder id (null for root)

  //file/folder flags
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  //timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fileRelation = relations(files, ({ one, many }) => ({
  // each file / folder can have one parent folder
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
    relationName: "parent",
  }),
  // relationship to child file/folder
  children: many(files, {
    relationName: "parent",
  }),
}));

export const FileType = typeof files.$inferSelect;
export const NewFileTYpe = typeof files.$inferInsert;
