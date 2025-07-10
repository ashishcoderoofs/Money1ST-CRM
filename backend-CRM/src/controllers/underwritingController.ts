import { Request, Response } from 'express';
import Underwriting from '../models/Underwriting';

export const createUnderwriting = async (req: Request, res: Response) => {
  try {
    const underwriting = await Underwriting.create(req.body);
    return res.status(201).json({ success: true, data: underwriting });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getUnderwritings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query = Underwriting.find(filters)
      .skip(skip)
      .limit(Number(limit));
    const total = await Underwriting.countDocuments(filters);
    const underwritings = await query;
    return res.json({ 
      success: true, 
      data: underwritings, 
      pagination: { 
        total, 
        page: Number(page), 
        pages: Math.ceil(total / Number(limit)) 
      } 
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getUnderwritingById = async (req: Request, res: Response) => {
  try {
    let underwriting;
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      underwriting = await Underwriting.findById(req.params.id);
    } else {
      underwriting = await Underwriting.findOne({ client_id: req.params.id });
    }
    if (!underwriting) {
      return res.status(404).json({ success: false, error: 'Underwriting not found' });
    }
    return res.json({ success: true, data: underwriting });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateUnderwriting = async (req: Request, res: Response) => {
  try {
    let underwriting;
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      underwriting = await Underwriting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      underwriting = await Underwriting.findOneAndUpdate({ client_id: req.params.id }, req.body, { new: true });
    }
    if (!underwriting) {
      return res.status(404).json({ success: false, error: 'Underwriting not found' });
    }
    return res.json({ success: true, data: underwriting });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteUnderwriting = async (req: Request, res: Response) => {
  try {
    const underwriting = await Underwriting.findByIdAndDelete(req.params.id);
    if (!underwriting) {
      return res.status(404).json({ success: false, error: 'Underwriting not found' });
    }
    return res.json({ success: true, message: 'Underwriting deleted' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
}; 