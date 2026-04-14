import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const assessment = await db.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar avaliação' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      adminObservation,
      economyMinEdited,
      economyMaxEdited,
      financialRiskLevelEdited,
      financialLossEdited,
      status,
      visibleSections,
      responses,
      resultJson,
      totalScore,
    } = body;

    console.log(`--- PUT /api/assessment/${id} ---`);
    console.log('Status received:', status);
    console.log('Fields to update:', Object.keys(body));

    const assessment = await db.assessment.findUnique({ where: { id } });
    if (!assessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (adminObservation !== undefined) updateData.adminObservation = adminObservation;
    if (economyMinEdited !== undefined) updateData.economyMinEdited = economyMinEdited;
    if (economyMaxEdited !== undefined) updateData.economyMaxEdited = economyMaxEdited;
    if (financialRiskLevelEdited !== undefined) updateData.financialRiskLevelEdited = financialRiskLevelEdited;
    if (financialLossEdited !== undefined) updateData.financialLossEdited = financialLossEdited;
    if (responses !== undefined) updateData.responses = responses;
    if (totalScore !== undefined) updateData.totalScore = totalScore;

    if (resultJson !== undefined) {
      updateData.resultJson = typeof resultJson === 'string' ? resultJson : JSON.stringify(resultJson);
    } else if (visibleSections !== undefined) {
      try {
        const existingJson = assessment.resultJson ? JSON.parse(assessment.resultJson as string) : {};
        existingJson.visibleSections = visibleSections;
        updateData.resultJson = JSON.stringify(existingJson);
      } catch {
        updateData.resultJson = JSON.stringify({ visibleSections });
      }
    }

    if (status === 'released') {
      updateData.status = 'released';
      updateData.releasedAt = new Date();
    } else if (status === 'sent') {
      updateData.status = 'sent';
    } else if (status) {
      updateData.status = status;
    }

    const updated = await db.assessment.update({
      where: { id },
      data: updateData,
    });

    console.log('Assessment updated successfully');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error in PUT /api/assessment:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar avaliação' },
      { status: 500 }
    );
  }
}
