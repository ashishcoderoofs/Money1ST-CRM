import { Request, Response } from 'express';
import { Applicant } from '../models';

export const createApplicant = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.create(req.body);
    res.status(201).json({ success: true, data: applicant });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getApplicants = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query = Applicant.find(filters)
      .skip(skip)
      .limit(Number(limit));
    const total = await Applicant.countDocuments(filters);
    const applicants = await query;
    res.json({ success: true, data: applicants, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getApplicantById = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ success: false, error: 'Applicant not found' });
    res.json({ success: true, data: applicant });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateApplicant = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!applicant) return res.status(404).json({ success: false, error: 'Applicant not found' });
    res.json({ success: true, data: applicant });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteApplicant = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.findByIdAndDelete(req.params.id);
    if (!applicant) return res.status(404).json({ success: false, error: 'Applicant not found' });
    res.json({ success: true, message: 'Applicant deleted' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};
