import { Request, Response } from 'express';
import * as aiService from '../services/aiService';
import { prisma } from '../db';

export async function sendMessage(req: Request, res: Response) {
  const { conversationId, content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required and must be a string' });
  }

  const conversationIdNumber = Number(conversationId);
  if (!conversationId || Number.isNaN(conversationIdNumber)) {
    return res.status(400).json({ error: 'conversationId is required and must be a numeric id' });
  }

  try {
    const conversation = await prisma.conversation.findUnique({ where: { id: conversationIdNumber } });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found. Create a conversation first.' });
    }

    await prisma.message.create({
      data: {
        conversationId: conversationIdNumber,
        role: 'USER',
        content,
      }
    });

    const aiFullContent = await aiService.getFlowiseStream(content, res);

    if (aiFullContent) {
      await prisma.message.create({
        data: {
          conversationId: conversationIdNumber,
          role: 'ASSISTANT',
          content: aiFullContent,
        }
      });
    }

  } catch (error) {
    console.error('Chat Controller Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export async function createConversation(req: Request, res: Response) {
  const { title } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: {
        ownerId: userId,
        title: typeof title === 'string' ? title : 'Test conversation',
      },
    });
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create Conversation Error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
}
