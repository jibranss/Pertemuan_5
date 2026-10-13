import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { mahasiswa } from '../db/schema.js';

const router = Router();

router.get('/', async (_req, res) => {
  res.json(await db.select().from(mahasiswa));
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID mahasiswa tidak valid' });
  }

  const [result] = await db.select().from(mahasiswa).where(eq(mahasiswa.id, id));
  if (!result) {
    return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
  }

  return res.json(result);
});

router.post('/', async (req, res) => {
  const { nama, nim, jurusan } = req.body ?? {};
  if (![nama, nim, jurusan].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'nama, nim, dan jurusan wajib diisi' });
  }

  const [created] = await db
    .insert(mahasiswa)
    .values({ nama: nama.trim(), nim: nim.trim(), jurusan: jurusan.trim() })
    .returning();
  return res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID mahasiswa tidak valid' });
  }

  const [existing] = await db.select().from(mahasiswa).where(eq(mahasiswa.id, id));
  if (!existing) {
    return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
  }

  const { nama, nim, jurusan } = req.body ?? {};
  for (const [field, value] of Object.entries({ nama, nim, jurusan })) {
    if (value !== undefined && (typeof value !== 'string' || !value.trim())) {
      return res.status(400).json({ message: `${field} harus berupa teks yang tidak kosong` });
    }
  }

  const [updated] = await db
    .update(mahasiswa)
    .set({
      nama: nama?.trim() ?? existing.nama,
      nim: nim?.trim() ?? existing.nim,
      jurusan: jurusan?.trim() ?? existing.jurusan
    })
    .where(eq(mahasiswa.id, id))
    .returning();
  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID mahasiswa tidak valid' });
  }

  const [deleted] = await db.delete(mahasiswa).where(eq(mahasiswa.id, id)).returning();
  if (!deleted) {
    return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
  }

  return res.json({ message: 'Mahasiswa berhasil dihapus', data: deleted });
});

export default router;
