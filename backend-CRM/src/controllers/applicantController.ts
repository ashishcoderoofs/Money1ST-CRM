import { Request, Response } from 'express';
import { Applicant, Liability } from '../models';

export const createApplicant = async (req: Request, res: Response) => {
  try {
    const applicantData = req.body.applicant;
    let liabilityIds: any[] = [];
    if (applicantData.liabilities && Array.isArray(applicantData.liabilities) && applicantData.liabilities.length > 0) {
      // Create liabilities and get their ObjectIds
      const liabilitiesWithClientId = applicantData.liabilities.map((l: any) => ({ ...l, client_id: applicantData.client_id }));
      const createdLiabilities = await Liability.insertMany(liabilitiesWithClientId);
      liabilityIds = createdLiabilities.map((l: any) => l._id);
    }
    const mappedApplicant = {
      name_information: applicantData.name_information,
      current_address: {
        ...applicantData.contact, // <-- merge all contact fields here
        ...applicantData.current_address // months, years, etc.
      },
      previous_address: applicantData.previous_address,
      current_employment: applicantData.employment,
      previous_employment: applicantData.previous_employment,
      demographics_information: {
        birth_place: applicantData.birth_place,
        dob: applicantData.date_of_birth,
        marital_status: applicantData.marital_status,
        race: applicantData.race,
        anniversary: applicantData.anniversary,
        spouse_name: applicantData.spouse_name,
        spouse_occupation: applicantData.spouse_occupation,
        number_of_dependents: applicantData.number_of_dependents
      },
      household_members: applicantData.household_members,
      client_id: applicantData.client_id,
      entry_date: applicantData.entry_date,
      payoff_amount: applicantData.payoff_amount,
      notes: applicantData.notes,
      created_at: applicantData.created_at,
      createdAt: applicantData.createdAt,
      updatedAt: applicantData.updatedAt,
      liabilities: liabilityIds
    };
    const applicant = await Applicant.create(mappedApplicant);
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
      .limit(Number(limit))
      .populate('liabilities'); // Populate liabilities
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
    const applicant = await Applicant.findById(req.params.id).populate('liabilities'); // Populate liabilities
    if (!applicant) return res.status(404).json({ success: false, error: 'Applicant not found' });
    res.json({ success: true, data: applicant });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateApplicant = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let liabilityIds: any[] = [];
    if (data.liabilities && Array.isArray(data.liabilities) && data.liabilities.length > 0) {
      // Remove existing liabilities for this applicant
      if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
        await Liability.deleteMany({ client_id: req.params.id });
      } else if (data.client_id) {
        await Liability.deleteMany({ client_id: data.client_id });
      }
      // Create new liabilities
      const liabilitiesWithClientId = data.liabilities.map((l: any) => ({ ...l, client_id: data.client_id }));
      const createdLiabilities = await Liability.insertMany(liabilitiesWithClientId);
      liabilityIds = createdLiabilities.map((l: any) => l._id);
    }
    const mappedApplicant = {
      name_infromation: data.name_infromation,
      current_address: data.current_address,
      previous_address: data.previous_address,
      current_employment: data.current_employment,
      previous_employment: data.previous_employment,
      demographics_information: data.demographics_information,
      household_members: data.household_members,
      client_id: data.client_id,
      entry_date: data.entry_date,
      payoff_amount: data.payoff_amount,
      notes: data.notes,
      created_at: data.created_at,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      liabilities: liabilityIds
    };
    let applicant;
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      applicant = await Applicant.findByIdAndUpdate(req.params.id, mappedApplicant, { new: true });
    } else {
      applicant = await Applicant.findOneAndUpdate({ client_id: req.params.id }, mappedApplicant, { new: true });
    }
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
