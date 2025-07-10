import { Request, Response } from 'express';
import { Client, Applicant, Property, Mortgage, LoanDetails, LoanOptions, Underwriting, CHM, TUD, Liability } from '../models';
import { CoApplicant } from '../models/CoApplicant';

export const createClient = async (req: Request, res: Response) => {
  try {
    console.log('--- Incoming createClient request body ---');
    console.dir(req.body, { depth: null });
    // Defensive: Remove client_id if present in request body
    if ('client_id' in req.body) delete req.body.client_id;
    // Map applicant fields to new nested structure
    const applicantData = req.body.applicant;
    const mappedApplicant = {
      name_information: applicantData.name_information,
      current_address: {
        ...applicantData.contact,
        ...applicantData.current_address
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
      updatedAt: applicantData.updatedAt
    };
    const applicant = await Applicant.create(mappedApplicant);
    console.log('Created applicant:', applicant);
    let co_applicant = null;
    if (req.body.co_applicant) {
      const coApplicantData = req.body.co_applicant;
      const mappedCoApplicant = {
        name_information: coApplicantData.name_information,
        current_address: {
          ...coApplicantData.contact,
          ...coApplicantData.current_address
        },
        previous_address: coApplicantData.previous_address,
        current_employment: coApplicantData.employment,
        previous_employment: coApplicantData.previous_employment,
        demographics_information: {
          birth_place: coApplicantData.birth_place,
          dob: coApplicantData.date_of_birth,
          marital_status: coApplicantData.marital_status,
          race: coApplicantData.race,
          anniversary: coApplicantData.anniversary,
          spouse_name: coApplicantData.spouse_name,
          spouse_occupation: coApplicantData.spouse_occupation,
          number_of_dependents: coApplicantData.number_of_dependents
        },
        household_members: coApplicantData.household_members,
        client_id: coApplicantData.client_id,
        entry_date: coApplicantData.entry_date,
        payoff_amount: coApplicantData.payoff_amount,
        notes: coApplicantData.notes,
        created_at: coApplicantData.created_at,
        createdAt: coApplicantData.createdAt,
        updatedAt: coApplicantData.updatedAt
      };
      co_applicant = await Applicant.create(mappedCoApplicant);
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
      .limit(Number(limit))
      .populate('applicant')
      .populate('co_applicant');
    const total = await Client.countDocuments(filters);
    const clients = await query;

    // Transform the data to only include required fields
    const clientList = clients.map(client => {
      let applicantName = 'N/A', coApplicantName = 'N/A';
      // Defensive: check for populated applicant object and correct field name
      if (
        client.applicant &&
        typeof client.applicant === 'object' &&
        client.applicant !== null &&
        !Array.isArray(client.applicant)
      ) {
        const applicant = client.applicant as any;
        // Try both 'name_information' and fallback to root fields
        if (applicant.name_information && typeof applicant.name_information === 'object') {
          applicantName = [applicant.name_information.first_name, applicant.name_information.last_name].filter(Boolean).join(' ') || 'N/A';
        } else {
          applicantName = [applicant.first_name, applicant.last_name].filter(Boolean).join(' ') || 'N/A';
        }
      }
      if (
        client.co_applicant &&
        typeof client.co_applicant === 'object' &&
        client.co_applicant !== null &&
        !Array.isArray(client.co_applicant)
      ) {
        const coApplicant = client.co_applicant as any;
        if (coApplicant.name_information && typeof coApplicant.name_information === 'object') {
          coApplicantName = [coApplicant.name_information.first_name, coApplicant.name_information.last_name].filter(Boolean).join(' ') || 'N/A';
        } else {
          coApplicantName = [coApplicant.first_name, coApplicant.last_name].filter(Boolean).join(' ') || 'N/A';
        }
      }
      // Calculate totalDebt from liabilities
      let totalDebt = 0;
      if (Array.isArray(client.liabilities)) {
        for (const liability of client.liabilities) {
          if (liability && typeof liability === 'object' && 'amount' in liability && typeof liability.amount === 'number') {
            totalDebt += liability.amount;
          }
        }
      }
      return {
        clientId: client.client_id || client._id,
        entryDate: client.entry_date ? new Date(client.entry_date).toISOString().split('T')[0] : 'N/A',
        applicantName,
        coApplicantName,
        consultant: client.consultant_name || 'N/A',
        processor: client.processor_name || 'N/A',
        totalDebt: totalDebt || 'N/A',
        status: client.status || 'N/A',
      };
    });

    res.json({
      success: true,
      data: clientList,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    let client = null;
    // Try to find by MongoDB ObjectId
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      client = await Client.findById(req.params.id)
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
    }
    // If not found, or not a valid ObjectId, try by client_id
    if (!client) {
      client = await Client.findOne({ client_id: req.params.id })
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
    }
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    // Build a clean, camelCase-only response
    const obj = client.toObject();
    // Helper to map Applicant fields to camelCase
    function mapApplicant(app: any) {
      if (!app) return {};
      return {
        title: app.name_information?.title || '',
        firstName: app.name_information?.first_name || '',
        middleInitial: app.name_information?.middle_initial || '',
        lastName: app.name_information?.last_name || '',
        maidenName: app.name_information?.maiden_name || '',
        suffix: app.name_information?.suffix || '',
        isConsultant: app.name_information?.is_consultant || false,
        currentAddress: {
          address: app.current_address?.address || '',
          city: app.current_address?.city || '',
          state: app.current_address?.state || '',
          zipCode: app.current_address?.zip_code || '',
          county: app.current_address?.county || '',
          homePhone: app.current_address?.home_phone || '',
          workPhone: app.current_address?.work_phone || '',
          cellPhone: app.current_address?.cell_phone || '',
          otherPhone: app.current_address?.other_phone || '',
          email: app.current_address?.email || '',
          months: app.current_address?.months || '',
          years: app.current_address?.years || '',
          howLongAtCurrentAddress: app.current_address?.how_long_at_current_address || '',
          fax: app.current_address?.fax || '',
        },
        previousAddress: {
          address: app.previous_address?.address || '',
          city: app.previous_address?.city || '',
          state: app.previous_address?.state || '',
          zipCode: app.previous_address?.zip_code || '',
          months: app.previous_address?.months || '',
          years: app.previous_address?.years || '',
          duration: app.previous_address?.duration || '',
        },
        currentEmployment: {
          status: app.current_employment?.status || '',
          isBusinessOwner: app.current_employment?.is_business_owner || '',
          employerName: app.current_employment?.employer_name || '',
          employerAddress: app.current_employment?.employer_address || '',
          employerCity: app.current_employment?.employer_city || '',
          employerState: app.current_employment?.employer_state || '',
          employerZipCode: app.current_employment?.employer_zip_code || '',
          occupation: app.current_employment?.occupation || '',
          monthlySalary: app.current_employment?.monthly_salary || '',
          otherIncome: app.current_employment?.other_income || '',
          startDate: app.current_employment?.start_date || '',
          endDate: app.current_employment?.end_date || '',
          supervisor: app.current_employment?.supervisor || '',
          supervisorPhone: app.current_employment?.supervisor_phone || '',
          source: app.current_employment?.source || '',
        },
        previousEmployment: {
          employerName: app.previous_employment?.employer_name || '',
          employerAddress: app.previous_employment?.employer_address || '',
          employerCity: app.previous_employment?.employer_city || '',
          employerState: app.previous_employment?.employer_state || '',
          employerZipCode: app.previous_employment?.employer_zip_code || '',
          fromDate: app.previous_employment?.from_date || '',
          toDate: app.previous_employment?.to_date || '',
          occupation: app.previous_employment?.occupation || '',
        },
        demographics: {
          birthPlace: app.demographics_information?.birth_place || '',
          dob: app.demographics_information?.dob || '',
          maritalStatus: app.demographics_information?.marital_status || '',
          race: app.demographics_information?.race || '',
          anniversary: app.demographics_information?.anniversary || '',
          spouseName: app.demographics_information?.spouse_name || '',
          spouseOccupation: app.demographics_information?.spouse_occupation || '',
          numberOfDependents: app.demographics_information?.number_of_dependents || '',
        },
        householdMembers: Array.isArray(app.household_members) ? app.household_members.map((m: any) => ({
          firstName: m.first_name || '',
          middleInitial: m.middle_initial || '',
          lastName: m.last_name || '',
          relationship: m.relationship || '',
          dob: m.dob || '',
          age: m.age || '',
          sex: m.sex || '',
          maritalStatus: m.marital_status || '',
          ssn: m.ssn || '',
        })) : [],
      };
    }
    const response = {
      id: obj._id,
      clientId: obj.client_id,
      entryDate: obj.entry_date,
      status: obj.status,
      payoffAmount: obj.payoff_amount,
      consultantName: obj.consultant_name,
      processorName: obj.processor_name,
      applicant: mapApplicant(obj.applicant),
      coApplicant: mapApplicant(obj.co_applicant),
      liabilities: obj.liabilities || [],
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      // add more fields as needed by the frontend only
    };
    return res.json({ success: true, data: response });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    console.log('--- Incoming updateClient request body ---');
    console.dir(req.body, { depth: null });
    const update = { ...req.body };
    if (update.applicant) {
      update.applicant = {
        ...update.applicant,
        current_address: {
          ...update.applicant.contact,
          ...update.applicant.current_address
        },
        current_employment: update.applicant.employment,
        demographics_information: {
          birth_place: update.applicant.birth_place,
          dob: update.applicant.date_of_birth,
          marital_status: update.applicant.marital_status,
          race: update.applicant.race,
          anniversary: update.applicant.anniversary,
          spouse_name: update.applicant.spouse_name,
          spouse_occupation: update.applicant.spouse_occupation,
          number_of_dependents: update.applicant.number_of_dependents
        }
      };
    }
    if (update.co_applicant) {
      // If include_coapplicant is false, remove co-applicant from DB and update object
      if (update.co_applicant.include_coapplicant === false) {
        // Remove co-applicant from DB if exists
        const clientRecord = await Client.findById(req.params.id);
        if (clientRecord && clientRecord.co_applicant) {
          await CoApplicant.findByIdAndDelete(clientRecord.co_applicant);
          update.co_applicant = undefined;
          update.$unset = { co_applicant: 1 };
        }
      } else {
        update.co_applicant = {
          ...update.co_applicant,
          current_address: {
            ...update.co_applicant.contact,
            ...update.co_applicant.current_address
          },
          current_employment: update.co_applicant.employment,
          demographics_information: {
            birth_place: update.co_applicant.birth_place,
            dob: update.co_applicant.date_of_birth,
            marital_status: update.co_applicant.marital_status,
            race: update.co_applicant.race,
            anniversary: update.co_applicant.anniversary,
            spouse_name: update.co_applicant.spouse_name,
            spouse_occupation: update.co_applicant.spouse_occupation,
            number_of_dependents: update.co_applicant.number_of_dependents
          }
        };
      }
    }
    console.log('--- Transformed update object ---');
    console.dir(update, { depth: null });
    let client;
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      client = await Client.findByIdAndUpdate(req.params.id, update, { new: true });
    } else {
      client = await Client.findOneAndUpdate({ client_id: req.params.id }, update, { new: true });
    }
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, data: client });
  } catch (error) {
    const err = error as Error;
    console.error('Error in updateClient:', err);
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
