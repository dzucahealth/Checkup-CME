import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assessments = await db.assessment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log(`GET /api/assessments: Found ${assessments.length} records`);

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar avaliações' },
      { status: 500 }
    );
  }
}
