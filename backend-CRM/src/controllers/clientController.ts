import { Request, Response } from 'express';
import { Client, Applicant, Property, Mortgage, LoanDetails, LoanOptions, Underwriting, CHM, TUD, Liability } from '../models';
import { CoApplicant } from '../models/CoApplicant';

function validateDriverBackend(driver) {
  const nameRegex = /^[A-Za-z\s\-']+$/;
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  const errors = {};
  if (!driver.fullName || !nameRegex.test(driver.fullName)) {
    errors.fullName = 'Full Name is required and can only contain letters, spaces, hyphens, and apostrophes.';
  }
  if (!driver.dateOfBirth) {
    errors.dateOfBirth = 'DOB is required.';
  } else {
    const dob = new Date(driver.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (isNaN(age) || age < 16 || age > 99) {
      errors.dateOfBirth = 'Driver must be at least 16 years old.';
    }
  }
  if (!driver.age || isNaN(driver.age) || driver.age < 16 || driver.age > 99) {
    errors.age = 'Age must be between 16 and 99.';
  }
  if (!driver.relationship) {
    errors.relationship = 'Relationship is required.';
  }
  if (!driver.ssn || !ssnRegex.test(driver.ssn)) {
    errors.ssn = 'SSN must be in the format XXX-XX-XXXX.';
  }
  if (!driver.sex) {
    errors.sex = 'Sex is required.';
  }
  if (!driver.maritalStatus) {
    errors.maritalStatus = 'Marital Status is required.';
  }
  if (!driver.drivingStatus) {
    errors.drivingStatus = 'Driving Status is required.';
  }
  if (driver.drivingStatus === 'licensed' && !driver.licenseNumber) {
    errors.licenseNumber = 'License Number is required for licensed drivers.';
  }
  if (!driver.state) {
    errors.state = 'State is required.';
  }
  if (
    driver.accidentsViolations === '' ||
    isNaN(Number(driver.accidentsViolations)) ||
    Number(driver.accidentsViolations) < 0 ||
    Number(driver.accidentsViolations) > 99
  ) {
    errors.accidentsViolations = 'Accidents/Violations must be a number between 0 and 99.';
  }
  return errors;
}

export const createClient = async (req: Request, res: Response) => {
  try {
    console.log('--- Incoming createClient request body ---');
    console.dir(req.body, { depth: null });
    // Defensive: Remove client_id if present in request body
    if ('client_id' in req.body) delete req.body.client_id;

    // Fix status case to match enum values
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'pending': 'Pending', 
      'inactive': 'Inactive',
      'Active': 'Active',
      'Pending': 'Pending',
      'Inactive': 'Inactive'
    };
    const normalizedStatus = req.body.status ? statusMap[req.body.status] || req.body.status : 'Active';
    
    // 1. Create the client with minimal info (no applicant, co_applicant, or liabilities yet)
    const minimalClient = await Client.create({
      entry_date: req.body.entry_date,
      status: normalizedStatus,
      payoff_amount: req.body.payoff_amount,
      consultant_name: req.body.consultant_name,
      processor_name: req.body.processor_name,
    });
    console.log('Created minimal client:', minimalClient);

    // Add loanStatus if provided
    if (req.body.loanStatus) {
      minimalClient.loanStatus = req.body.loanStatus;
      await minimalClient.save();
    }

    // Add drivers if provided
    if (req.body.drivers) {
      const driverErrors = req.body.drivers.map(validateDriverBackend);
      if (driverErrors.some(e => Object.keys(e).length > 0)) {
        return res.status(400).json({ success: false, error: 'Driver validation failed', details: driverErrors });
      }
      minimalClient.drivers = req.body.drivers;
      await minimalClient.save();
    }

    // 2. Create applicant(s) with client._id as client_id
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
      client_id: minimalClient._id, // Use ObjectId
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
        client_id: minimalClient._id, // Use ObjectId
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

    // 3. Create liabilities with client._id as client_id
    let liabilityIds: any[] = [];
    if (applicantData.liabilities && Array.isArray(applicantData.liabilities) && applicantData.liabilities.length > 0) {
      const liabilitiesWithClientId = applicantData.liabilities.map((l: any) => ({ ...l, client_id: minimalClient._id }));
      const createdLiabilities = await Liability.insertMany(liabilitiesWithClientId);
      liabilityIds = createdLiabilities.map((l: any) => l._id);
    }

    // 4. Update applicant(s) and client to reference the created liabilities
    applicant.liabilities = liabilityIds;
    await applicant.save();
    if (co_applicant) {
      co_applicant.liabilities = [];
      await co_applicant.save();
    }
    minimalClient.applicant = applicant._id;
    minimalClient.co_applicant = co_applicant ? co_applicant._id : undefined;
    minimalClient.liabilities = liabilityIds;
    await minimalClient.save();

    // 5. Create mortgages if mortgage data is present
    let firstMortgageId, secondMortgageId, proposedFirstLoanId, proposedSecondLoanId;
    if (req.body.mortgage) {
      const m = req.body.mortgage;
      if (m.first_mortgage_balance || m.first_mortgage_rate || m.first_mortgage_term || m.first_mortgage_payment || m.lienholder_1 || m.address || m.city || m.state || m.zip_code || m.occupancy_type) {
        const firstMortgage = await Mortgage.create({
          client_id: minimalClient._id,
          type: 'first',
          // Property information
          address: m.address,
          city: m.city,
          state: m.state,
          zip_code: m.zip_code,
          occupancy_type: m.occupancy_type,
          // Mortgage details
          balance: m.first_mortgage_balance,
          rate: m.first_mortgage_rate,
          term: m.first_mortgage_term,
          payment: m.first_mortgage_payment,
          lienholder: m.lienholder_1
        });
        firstMortgageId = firstMortgage._id;
      }
      if (m.second_mortgage_balance || m.second_mortgage_rate || m.second_mortgage_term || m.second_mortgage_payment || m.lienholder_2) {
        const secondMortgage = await Mortgage.create({
          client_id: minimalClient._id,
          type: 'second',
          balance: m.second_mortgage_balance,
          rate: m.second_mortgage_rate,
          term: m.second_mortgage_term,
          payment: m.second_mortgage_payment,
          lienholder: m.lienholder_2
        });
        secondMortgageId = secondMortgage._id;
      }
      if (m.first_loan_amount || m.first_loan_rate || m.first_loan_term || m.first_loan_new_payment) {
        const proposedFirstLoan = await Mortgage.create({
          client_id: minimalClient._id,
          type: 'proposed_first',
          amount: m.first_loan_amount,
          rate: m.first_loan_rate,
          term: m.first_loan_term,
          int_term: m.first_loan_int_term,
          new_payment: m.first_loan_new_payment
        });
        proposedFirstLoanId = proposedFirstLoan._id;
      }
      if (m.second_loan_amount || m.second_loan_rate || m.second_loan_term || m.second_loan_new_payment) {
        const proposedSecondLoan = await Mortgage.create({
          client_id: minimalClient._id,
          type: 'proposed_second',
          amount: m.second_loan_amount,
          rate: m.second_loan_rate,
          term: m.second_loan_term,
          int_term: m.second_loan_int_term,
          new_payment: m.second_loan_new_payment
        });
        proposedSecondLoanId = proposedSecondLoan._id;
      }
    }
    // 6. Update client with mortgage ObjectIds
    if (firstMortgageId) minimalClient.first_mortgage = firstMortgageId;
    if (secondMortgageId) minimalClient.second_mortgage = secondMortgageId;
    if (proposedFirstLoanId) minimalClient.proposed_first_loan = proposedFirstLoanId;
    if (proposedSecondLoanId) minimalClient.proposed_second_loan = proposedSecondLoanId;
    await minimalClient.save();

    // 7. Create underwriting if underwriting data is present
    let underwritingId;
    if (req.body.underwriting) {
      const underwritingData = req.body.underwriting;
      if (Object.keys(underwritingData).length > 0) {
        const underwriting = await Underwriting.create({
          client_id: minimalClient._id,
          address: underwritingData.address,
          city: underwritingData.city,
          state: underwritingData.state,
          chm_selection: underwritingData.chm_selection,
          tud_selection: underwritingData.tud_selection,
          equifax_applicant: underwritingData.equifax_applicant,
          equifax_co_applicant: underwritingData.equifax_co_applicant,
          experian_applicant: underwritingData.experian_applicant,
          experian_co_applicant: underwritingData.experian_co_applicant,
          transunion_applicant: underwritingData.transunion_applicant,
          transunion_co_applicant: underwritingData.transunion_co_applicant,
          underwriting_notes: underwritingData.underwriting_notes,
          terms: underwritingData.terms,
          programs: underwritingData.programs
        });
        underwritingId = underwriting._id;
      }
    }

    // Optionally, create and associate other entities (property, mortgages, etc.) here as before
    // ... (existing property, mortgage, etc. creation logic can be inserted here, using minimalClient._id as needed)

    // Respond with the full client, populated
    const populatedClient = await Client.findById(minimalClient._id)
      .populate('applicant')
      .populate('co_applicant')
      .populate('liabilities')
      .populate('first_mortgage')
      .populate('second_mortgage')
      .populate('proposed_first_loan')
      .populate('proposed_second_loan');
      
    
    if (!populatedClient) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve created client' });
    }
    
    // Get underwriting data if it exists
    let underwritingData = null;
    if (underwritingId) {
      underwritingData = await Underwriting.findById(underwritingId);
    }
    
    // Combine client and underwriting data
    const responseData = {
      ...populatedClient.toObject(),
      underwriting: underwritingData
    };
    
    return res.status(201).json({ success: true, data: responseData });
  } catch (error) {
    const err = error as Error;
    console.error('Error in createClient:', err);
    return res.status(500).json({ success: false, error: err.message });
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

export const searchClients = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }
    const regex = new RegExp(query, 'i');

    // Aggregation to match client_id, consultant_name, or applicant name
    const clients = await Client.aggregate([
      {
        $lookup: {
          from: 'applicants',
          localField: 'applicant',
          foreignField: '_id',
          as: 'applicant'
        }
      },
      { $unwind: { path: '$applicant', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [
            { client_id: regex },
            { consultant_name: regex },
            { 'applicant.name_information.first_name': regex },
            { 'applicant.name_information.last_name': regex },
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $concat: [
                      { $ifNull: ['$applicant.name_information.first_name', ''] },
                      ' ',
                      { $ifNull: ['$applicant.name_information.last_name', ''] }
                    ]
                  },
                  regex: query,
                  options: 'i'
                }
              }
            }
          ]
        }
      }
    ]);

    // Map results as before
    const clientList = clients.map(client => {
      let applicantName = 'N/A', coApplicantName = 'N/A';
      if (client.applicant && client.applicant.name_information) {
        applicantName = [client.applicant.name_information.first_name, client.applicant.name_information.last_name].filter(Boolean).join(' ') || 'N/A';
      }
      // coApplicantName logic omitted for brevity
      return {
        clientId: client.client_id || client._id,
        entryDate: client.entry_date ? new Date(client.entry_date).toISOString().split('T')[0] : 'N/A',
        applicantName,
        coApplicantName,
        consultant: client.consultant_name || 'N/A',
        processor: client.processor_name || 'N/A',
        totalDebt: 'N/A', // You can add logic for liabilities if needed
        status: client.status || 'N/A',
      };
    });

    return res.json({ success: true, data: clientList });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    let client;
    
    // Check if the ID is a valid ObjectId format
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      // If it's a valid ObjectId, search by _id
      client = await Client.findById(req.params.id)
        .populate('applicant')
        .populate('co_applicant')
        .populate('liabilities')
        .populate('first_mortgage')
        .populate('second_mortgage')
        .populate('proposed_first_loan')
        .populate('proposed_second_loan');
    } else {
      // If it's not a valid ObjectId, search by client_id
      client = await Client.findOne({ client_id: req.params.id })
        .populate('applicant')
        .populate('co_applicant')
        .populate('liabilities')
        .populate('first_mortgage')
        .populate('second_mortgage')
        .populate('proposed_first_loan')
        .populate('proposed_second_loan');
    }
    
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    
    // Get underwriting data if it exists
    let underwritingData = null;
    try {
      underwritingData = await Underwriting.findOne({ client_id: client._id });
    } catch (error) {
      console.log('No underwriting data found for client:', client._id);
    }
    
    // Combine client and underwriting data
    const responseData = {
      ...client.toObject(),
      underwriting: underwritingData
    };
    
    return res.json({ success: true, data: responseData });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    console.log('UpdateClient - Request params:', req.params);
    console.log('UpdateClient - Request body:', req.body);
    
    let client;
    
    // Check if the ID is a valid ObjectId format
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      // If it's a valid ObjectId, search by _id
      client = await Client.findById(req.params.id);
    } else {
      // If it's not a valid ObjectId, search by client_id
      client = await Client.findOne({ client_id: req.params.id });
    }
    
    console.log('UpdateClient - Found client:', client ? client._id : 'Not found');
    
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });

    // Update basic client fields
    client.entry_date = req.body.entry_date || client.entry_date;
    // Fix status case to match enum values
    if (req.body.status) {
      const statusMap: { [key: string]: string } = {
        'active': 'Active',
        'pending': 'Pending', 
        'inactive': 'Inactive',
        'Active': 'Active',
        'Pending': 'Pending',
        'Inactive': 'Inactive'
      };
      client.status = statusMap[req.body.status] || req.body.status;
    }
    client.payoff_amount = req.body.payoff_amount || client.payoff_amount;
    client.consultant_name = req.body.consultant_name || client.consultant_name;
    client.processor_name = req.body.processor_name || client.processor_name;

    // --- Unified sub-object update logic ---
    // 1. Applicant
    if (req.body.applicant) {
      if (client.applicant) {
        await Applicant.findByIdAndUpdate(client.applicant, req.body.applicant, { new: true });
      } else {
        const newApplicant = await Applicant.create(req.body.applicant);
        client.applicant = newApplicant._id;
      }
    }
    // 2. Co-Applicant
    if (req.body.co_applicant) {
      if (client.co_applicant) {
        await Applicant.findByIdAndUpdate(client.co_applicant, req.body.co_applicant, { new: true });
      } else {
        const newCoApplicant = await Applicant.create(req.body.co_applicant);
        client.co_applicant = newCoApplicant._id;
      }
    }
    // 3. Liabilities
    if (req.body.liabilities) {
      // Remove existing liabilities
      await Liability.deleteMany({ client_id: client._id });
      // Create new liabilities
      const createdLiabilities = await Liability.insertMany(req.body.liabilities.map((l: any) => ({ ...l, client_id: client._id })));
      client.liabilities = createdLiabilities.map((l: any) => l._id);
    }
    // 4. Mortgage (first, second, proposed)
    if (req.body.mortgage) {
      const m = req.body.mortgage;
      // First Mortgage
      if (m.first_mortgage_balance || m.first_mortgage_rate || m.first_mortgage_term || m.first_mortgage_payment || m.lienholder_1 || m.address || m.city || m.state || m.zip_code || m.occupancy_type) {
        if (client.first_mortgage) {
            await Mortgage.findByIdAndUpdate(client.first_mortgage, {
              address: m.address,
              city: m.city,
              state: m.state,
              zip_code: m.zip_code,
              occupancy_type: m.occupancy_type,
              balance: m.first_mortgage_balance,
              rate: m.first_mortgage_rate,
              term: m.first_mortgage_term,
              payment: m.first_mortgage_payment,
              lienholder: m.lienholder_1
            });
        } else {
          const firstMortgage = await Mortgage.create({
            client_id: client._id,
            type: 'first',
            address: m.address,
            city: m.city,
            state: m.state,
            zip_code: m.zip_code,
            occupancy_type: m.occupancy_type,
            balance: m.first_mortgage_balance,
            rate: m.first_mortgage_rate,
            term: m.first_mortgage_term,
            payment: m.first_mortgage_payment,
            lienholder: m.lienholder_1
          });
          client.first_mortgage = firstMortgage._id;
        }
      }
      // Second Mortgage
      if (m.second_mortgage_balance || m.second_mortgage_rate || m.second_mortgage_term || m.second_mortgage_payment || m.lienholder_2) {
        if (client.second_mortgage) {
          await Mortgage.findByIdAndUpdate(client.second_mortgage, {
            balance: m.second_mortgage_balance,
            rate: m.second_mortgage_rate,
            term: m.second_mortgage_term,
            payment: m.second_mortgage_payment,
            lienholder: m.lienholder_2
          });
        } else {
          const secondMortgage = await Mortgage.create({
            client_id: client._id,
            type: 'second',
            balance: m.second_mortgage_balance,
            rate: m.second_mortgage_rate,
            term: m.second_mortgage_term,
            payment: m.second_mortgage_payment,
            lienholder: m.lienholder_2
          });
          client.second_mortgage = secondMortgage._id;
        }
      }
      // Proposed First Loan
      if (m.first_loan_amount || m.first_loan_rate || m.first_loan_term || m.first_loan_new_payment) {
        if (client.proposed_first_loan) {
          await Mortgage.findByIdAndUpdate(client.proposed_first_loan, {
            amount: m.first_loan_amount,
            rate: m.first_loan_rate,
            term: m.first_loan_term,
            int_term: m.first_loan_int_term,
            new_payment: m.first_loan_new_payment
          });
        } else {
          const proposedFirstLoan = await Mortgage.create({
            client_id: client._id,
            type: 'proposed_first',
            amount: m.first_loan_amount,
            rate: m.first_loan_rate,
            term: m.first_loan_term,
            int_term: m.first_loan_int_term,
            new_payment: m.first_loan_new_payment
          });
          client.proposed_first_loan = proposedFirstLoan._id;
        }
      }
      // Proposed Second Loan
      if (m.second_loan_amount || m.second_loan_rate || m.second_loan_term || m.second_loan_new_payment) {
        if (client.proposed_second_loan) {
          await Mortgage.findByIdAndUpdate(client.proposed_second_loan, {
            amount: m.second_loan_amount,
            rate: m.second_loan_rate,
            term: m.second_loan_term,
            int_term: m.second_loan_int_term,
            new_payment: m.second_loan_new_payment
          });
      } else {
          const proposedSecondLoan = await Mortgage.create({
            client_id: client._id,
            type: 'proposed_second',
            amount: m.second_loan_amount,
            rate: m.second_loan_rate,
            term: m.second_loan_term,
            int_term: m.second_loan_int_term,
            new_payment: m.second_loan_new_payment
          });
          client.proposed_second_loan = proposedSecondLoan._id;
        }
      }
    }
    // 5. Underwriting
    if (req.body.underwriting) {
      let existingUnderwriting = null;
      if (client.underwriting) {
        existingUnderwriting = await Underwriting.findByIdAndUpdate(client.underwriting, req.body.underwriting, { new: true });
          } else {
        existingUnderwriting = await Underwriting.create({ ...req.body.underwriting, client_id: client._id });
        client.underwriting = existingUnderwriting._id;
      }
    }
    // 6. Loan Status
    if (req.body.loanStatus) {
      client.loanStatus = req.body.loanStatus;
        }
    // Save client
    if (req.body.drivers) {
      const driverErrors = req.body.drivers.map(validateDriverBackend);
      if (driverErrors.some(e => Object.keys(e).length > 0)) {
        return res.status(400).json({ success: false, error: 'Driver validation failed', details: driverErrors });
      }
      client.drivers = req.body.drivers;
    }
    await client.save();
    
    console.log('UpdateClient - Populating client data');
    const populatedClient = await Client.findById(client._id)
      .populate('applicant')
      .populate('co_applicant')
      .populate('liabilities')
      .populate('first_mortgage')
      .populate('second_mortgage')
      .populate('proposed_first_loan')
      .populate('proposed_second_loan');
    console.log('UpdateClient - Client populated successfully');
    
    if (!populatedClient) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve updated client' });
    }
    
    // Get underwriting data if it exists
    let underwritingData = null;
    try {
      underwritingData = await Underwriting.findOne({ client_id: client._id });
      console.log('UpdateClient - Underwriting data retrieved:', underwritingData ? 'found' : 'not found');
    } catch (error) {
      console.log('UpdateClient - Error retrieving underwriting data:', error);
    }
    
    // Combine client and underwriting data
    try {
      const responseData = {
        ...populatedClient.toObject(),
        underwriting: underwritingData
      };
      console.log('UpdateClient - Response data prepared successfully');
      return res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      console.error('UpdateClient - Error preparing response data:', error);
      return res.status(500).json({ success: false, error: 'Failed to prepare response data' });
    }
  } catch (error) {
    const err = error as Error;
    console.error('UpdateClient - Main error:', err);
    console.error('UpdateClient - Error stack:', err.stack);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    let client;
    
    // Check if the ID is a valid ObjectId format
    if (/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
      // If it's a valid ObjectId, search and delete by _id
      client = await Client.findByIdAndDelete(req.params.id);
    } else {
      // If it's not a valid ObjectId, search and delete by client_id
      client = await Client.findOneAndDelete({ client_id: req.params.id });
    }
    
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    const err = error as Error;
    console.error('DeleteClient - Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};


export const getLoanStatus = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    return res.json({ success: true, data: client.loanStatus || null });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    client.loanStatus = { ...client.loanStatus, ...req.body };
    await client.save();
    return res.json({ success: true, data: client.loanStatus });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const createLoanStatus = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, error: 'Client not found' });
    if (client.loanStatus) {
      return res.status(400).json({ success: false, error: 'Loan status already exists. Use PUT to update.' });
    }
    client.loanStatus = req.body;
    await client.save();
    return res.status(201).json({ success: true, data: client.loanStatus });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};
