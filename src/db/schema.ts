import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const mahasiswa = sqliteTable('mahasiswa', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nama: text('nama').notNull(),
  nim: text('nim').notNull().unique(),
  jurusan: text('jurusan').notNull(),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`)
});

export const produk = sqliteTable('produk', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nama: text('nama').notNull(),
  harga: integer('harga').notNull(),
  stok: integer('stok').notNull().default(0),
  keterangan: text('keterangan'),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`)
});
