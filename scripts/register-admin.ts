// scripts/register-admin.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('--- Admin Registration ---');

  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', async (password) => {
      if (!username || !password) {
        console.error('Username and password cannot be empty.');
        rl.close();
        return;
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
          data: {
            username,
            password: hashedPassword,
            role: 'ADMIN', // Tambahkan baris ini untuk menetapkan peran
          },
        });

        console.log(`✅ Admin user "${admin.username}" with ADMIN role created successfully!`);
      } catch (e: any) {
        if (e.code === 'P2002') {
          console.error('❌ Error: This username already exists.');
        } else {
          console.error('An error occurred:', e.message);
        }
      } finally {
        await prisma.$disconnect();
        rl.close();
      }
    });
  });
}

main();
