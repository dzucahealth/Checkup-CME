import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      registrationData,
      responses,
      result,
    } = body;

    if (!registrationData || !responses || !result) {
      return NextResponse.json(
        { error: 'Dados obrigatórios ausentes' },
        { status: 400 }
      );
    }

    // Serialize responses Map to JSON string
    const responsesObj: Record<string, number> = {};
    if (responses instanceof Map) {
      responses.forEach((val, key) => { responsesObj[key] = val; });
    } else if (typeof responses === 'object') {
      Object.assign(responsesObj, responses);
    }

    // Find category scores
    const managementScore = result.categoryScores?.find((c: { category: string }) => c.category === 'gestao')?.percentage ?? null;
    const processScore = result.categoryScores?.find((c: { category: string }) => c.category === 'processo')?.percentage ?? null;
    const technologyScore = result.categoryScores?.find((c: { category: string }) => c.category === 'tecnologia')?.percentage ?? null;
    const financialScore = result.categoryScores?.find((c: { category: string }) => c.category === 'financeiro')?.percentage ?? null;

    const assessment = await db.assessment.create({
      data: {
        name: registrationData.name,
        position: registrationData.position,
        phone: registrationData.phone,
        email: registrationData.email,
        establishmentType: registrationData.establishmentType,
        bedCount: registrationData.bedCount,
        cmeProfessionals: registrationData.cmeProfessionals,
        region: registrationData.region,
        state: registrationData.state,
        consentGiven: true,
        totalScore: result.totalPercentage ?? result.totalScore,
        managementScore,
        processScore,
        technologyScore,
        financialScore,
        responses: JSON.stringify(responsesObj),
        resultJson: JSON.stringify(result),
      },
    });

    return NextResponse.json({ id: assessment.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar avaliação' },
      { status: 500 }
    );
  }
}
