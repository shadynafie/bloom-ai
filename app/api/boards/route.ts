import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all boards for user (owned + collaborated)
    const ownedBoards = await prisma.board.findMany({
      where: { userId: user.id },
      include: {
        nodes: true,
        edges: true,
        collaborators: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const collaboratedBoards = await prisma.board.findMany({
      where: {
        collaborators: {
          some: { userId: user.id },
        },
      },
      include: {
        nodes: true,
        edges: true,
        collaborators: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      owned: ownedBoards,
      collaborated: collaboratedBoards,
    });
  } catch (error) {
    console.error('Boards GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        title,
        description,
        userId: user.id,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    return NextResponse.json(board);
  } catch (error) {
    console.error('Boards POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
