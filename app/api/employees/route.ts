import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET semua karyawan
export async function GET() {
    // Di aplikasi nyata, Anda akan melindungi rute ini untuk memastikan hanya ADMIN yang bisa mengakses.
    try {
        const employees = await prisma.admin.findMany({
            where: { role: 'EMPLOYEE' },
            select: { id: true, username: true, createdAt: true } // Jangan kirim hash kata sandi
        });
        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

// POST karyawan baru
export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                role: 'EMPLOYEE',
            },
        });

        const { password: _, ...employeeData } = newEmployee;
        return NextResponse.json(employeeData, { status: 201 });

    } catch (error: any) {
        if (error.code === 'P2002') {
             return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
}

// DELETE seorang karyawan
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
        }

        await prisma.admin.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
    }
}
