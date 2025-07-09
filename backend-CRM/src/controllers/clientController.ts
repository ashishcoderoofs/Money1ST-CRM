import { Request, Response } from 'express';
import { Client, Applicant, Property, Mortgage, LoanDetails, LoanOptions, Underwriting, CHM, TUD, Liability } from '../models';

export const createClient = async (req: Request, res: Response) => {
  try {
    console.log('--- Incoming createClient request body ---');
    console.dir(req.body, { depth: null });
    // Defensive: Remove client_id if present in request body
    if ('client_id' in req.body) delete req.body.client_id;
    // Create subdocuments first
    const applicant = await Applicant.create(req.body.applicant);
    console.log('Created applicant:', applicant);
    let co_applicant = null;
    if (req.body.co_applicant) {
      co_applicant = await Applicant.create(req.body.co_applicant);
      console.log('Created co_applicant:', co_applicant);
    }
    const property = req.body.property ? await Property.create({ ...req.body.property }) : null;
    if (property) console.log('Created property:', property);
    const first_mortgage = req.body.first_mortgage ? await Mortgage.create({ ...req.body.first_mortgage, type: 'first' }) : null;
    if (first_mortgage) console.log('Created first_mortgage:', first_mortgage);
    const second_mortgage = req.body.second_mortgage ? await Mortgage.create({ ...req.body.second_mortgage, type: 'second' }) : null;
    if (second_mortgage) console.log('Created second_mortgage:', second_mortgage);
    const loan_details = req.body.loan_details ? await LoanDetails.create({ ...req.body.loan_details }) : null;
    if (loan_details) console.log('Created loan_details:', loan_details);
    const proposed_first_loan = req.body.proposed_first_loan ? await Mortgage.create({ ...req.body.proposed_first_loan, type: 'proposed_first' }) : null;
    if (proposed_first_loan) console.log('Created proposed_first_loan:', proposed_first_loan);
    const proposed_second_loan = req.body.proposed_second_loan ? await Mortgage.create({ ...req.body.proposed_second_loan, type: 'proposed_second' }) : null;
    if (proposed_second_loan) console.log('Created proposed_second_loan:', proposed_second_loan);
    const loan_options = req.body.loan_options ? await LoanOptions.create({ ...req.body.loan_options }) : null;
    if (loan_options) console.log('Created loan_options:', loan_options);
    const underwriting = req.body.underwriting ? await Underwriting.create({ ...req.body.underwriting }) : null;
    if (underwriting) console.log('Created underwriting:', underwriting);
    const chm = req.body.chm ? await CHM.create({ ...req.body.chm }) : null;
    if (chm) console.log('Created chm:', chm);
    const tud = req.body.tud ? await TUD.create({ ...req.body.tud }) : null;
    if (tud) console.log('Created tud:', tud);
    const liabilities = req.body.liabilities ? await Liability.insertMany(req.body.liabilities.map((l: any) => ({ ...l }))) : [];
    if (liabilities.length) console.log('Created liabilities:', liabilities);
    // Create client
    const client = await Client.create({
      applicant: applicant._id,
      co_applicant: co_applicant ? co_applicant._id : undefined,
      property: property ? property._id : undefined,
      first_mortgage: first_mortgage ? first_mortgage._id : undefined,
      second_mortgage: second_mortgage ? second_mortgage._id : undefined,
      loan_details: loan_details ? loan_details._id : undefined,
      proposed_first_loan: proposed_first_loan ? proposed_first_loan._id : undefined,
      proposed_second_loan: proposed_second_loan ? proposed_second_loan._id : undefined,
      loan_options: loan_options ? loan_options._id : undefined,
      underwriting: underwriting ? underwriting._id : undefined,
      chm: chm ? chm._id : undefined,
      tud: tud ? tud._id : undefined,
      liabilities: liabilities.map((l: any) => l._id),
      entry_date: req.body.entry_date,
      status: req.body.status,
      payoff_amount: req.body.payoff_amount,
      consultant_name: req.body.consultant_name,
      processor_name: req.body.processor_name,
    });
    console.log('Created client:', client);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    const err = error as Error;
    console.error('Error in createClient:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query = Client.find(filters)
      .skip(skip)
      .limit(Number(limit));
    const total = await Client.countDocuments(filters);
    const clients = await query;
    res.json({ success: true, data: clients, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('applicant')
      .populate('co_applicant')
      .populate('property')
      .populate('first_mortgage')
      .populate('second_mortgage')
      .populate('loan_details')
      .populate('proposed_first_loan')
      .populate('proposed_second_loan')
      .populate('loan_options')
      .populate('underwriting')
      .populate('chm')
      .populate('tud')
      .populate('liabilities');
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, data: client });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, data: client });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};
