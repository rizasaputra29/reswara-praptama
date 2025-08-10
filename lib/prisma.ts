// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Tambahkan timeout 30 detik untuk transaksi interaktif
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  transactionOptions: {
    maxWait: 5000, // default is 2000
    timeout: 30000, // default is 5000
  },
});

export default prisma;