import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
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

    const board = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        OR: [
          { userId: user.id },
          { collaborators: { some: { userId: user.id } } },
        ],
      },
      include: {
        nodes: true,
        edges: true,
        collaborators: true,
      },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error('Board GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
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
    const { title, description, nodes, edges } = body;

    const board = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        userId: user.id,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedBoard = await prisma.board.update({
      where: { id: params.boardId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Update nodes if provided
    if (nodes) {
      // Delete existing nodes not in the update
      await prisma.node.deleteMany({
        where: {
          boardId: params.boardId,
          id: { notIn: nodes.map((n: any) => n.id).filter(Boolean) },
        },
      });

      // Upsert nodes
      for (const node of nodes) {
        await prisma.node.upsert({
          where: { id: node.id || 'new' },
          create: {
            id: node.id,
            boardId: params.boardId,
            type: node.type,
            position: node.position,
            data: node.data,
            width: node.width,
            height: node.height,
          },
          update: {
            position: node.position,
            data: node.data,
            width: node.width,
            height: node.height,
          },
        });
      }
    }

    // Update edges if provided
    if (edges) {
      await prisma.edge.deleteMany({
        where: {
          boardId: params.boardId,
          id: { notIn: edges.map((e: any) => e.id).filter(Boolean) },
        },
      });

      for (const edge of edges) {
        await prisma.edge.upsert({
          where: { id: edge.id || 'new' },
          create: {
            id: edge.id,
            boardId: params.boardId,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated,
            label: edge.label,
          },
          update: {
            source: edge.source,
            target: edge.target,
            type: edge.type,
            animated: edge.animated,
            label: edge.label,
          },
        });
      }
    }

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('Board PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
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

    const board = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        userId: user.id,
      },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.board.delete({
      where: { id: params.boardId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Board DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
