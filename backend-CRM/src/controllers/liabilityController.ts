import { Request, Response } from 'express';
import Liability from '../models/Liability';

export async function createLiability(req: Request, res: Response) {
  try {
    const liability = new Liability(req.body);
    await liability.save();
    res.status(201).json(liability);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
} 