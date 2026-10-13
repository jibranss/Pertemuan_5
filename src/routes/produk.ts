import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { produk } from '../db/schema.js';

const router = Router();

router.get('/', async (_req, res) => {
  res.json(await db.select().from(produk));
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const [result] = await db.select().from(produk).where(eq(produk.id, id));
  if (!result) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  return res.json(result);
});

router.post('/', async (req, res) => {
  const { nama, harga, stok, keterangan } = req.body ?? {};
  if (typeof nama !== 'string' || !nama.trim()) {
    return res.status(400).json({ message: 'nama wajib diisi' });
  }
  if (!Number.isSafeInteger(harga) || harga < 0 || !Number.isSafeInteger(stok) || stok < 0) {
    return res.status(400).json({ message: 'harga dan stok harus bilangan bulat non-negatif' });
  }
  if (keterangan !== undefined && keterangan !== null && typeof keterangan !== 'string') {
    return res.status(400).json({ message: 'keterangan harus berupa teks' });
  }

  const [created] = await db
    .insert(produk)
    .values({ nama: nama.trim(), harga, stok, keterangan: keterangan ?? null })
    .returning();
  return res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const [existing] = await db.select().from(produk).where(eq(produk.id, id));
  if (!existing) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  const { nama, harga, stok, keterangan } = req.body ?? {};
  if (nama !== undefined && (typeof nama !== 'string' || !nama.trim())) {
    return res.status(400).json({ message: 'nama harus berupa teks yang tidak kosong' });
  }
  if (harga !== undefined && (!Number.isSafeInteger(harga) || harga < 0)) {
    return res.status(400).json({ message: 'harga harus bilangan bulat non-negatif' });
  }
  if (stok !== undefined && (!Number.isSafeInteger(stok) || stok < 0)) {
    return res.status(400).json({ message: 'stok harus bilangan bulat non-negatif' });
  }
  if (keterangan !== undefined && keterangan !== null && typeof keterangan !== 'string') {
    return res.status(400).json({ message: 'keterangan harus berupa teks' });
  }

  const [updated] = await db
    .update(produk)
    .set({
      nama: nama?.trim() ?? existing.nama,
      harga: harga ?? existing.harga,
      stok: stok ?? existing.stok,
      keterangan: keterangan === undefined ? existing.keterangan : keterangan
    })
    .where(eq(produk.id, id))
    .returning();
  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const [deleted] = await db.delete(produk).where(eq(produk.id, id)).returning();
  if (!deleted) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  return res.json({ message: 'Produk berhasil dihapus', data: deleted });
});

export default router;
