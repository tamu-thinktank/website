import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    try {
        const transfer = await req.json() as { applicantIds: string[] };

        if (!transfer.applicantIds || transfer.applicantIds.length === 0) {
            return NextResponse.json({ error: 'No applicants provided.' }, { status: 400 });
        }

        await prisma.application.updateMany({
            where: { id: { in: transfer.applicantIds } },
            data: { status: 'ACCEPTED' }
        });

        return NextResponse.json({ message: 'Applicants transferred successfully.' });
    } catch (error) {
        console.error('Error transferring applicants:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}