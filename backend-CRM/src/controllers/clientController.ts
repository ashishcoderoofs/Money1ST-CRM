import { Request, Response } from 'express';
import { Client, Applicant, Property, Mortgage, LoanDetails, LoanOptions, Underwriting, CHM, TUD, Liability } from '../models';
import CoApplicant from '../models/CoApplicant';

interface Driver {
  fullName: string;
  dateOfBirth: string;
  age: number;
  relationship: string;
  ssn: string;
  sex: string;
  maritalStatus: string;
  drivingStatus: string;
  licenseNumber?: string;
  state: string;
  accidentsViolations: string | number;
}

type DriverValidationErrors = Partial<Record<keyof Driver, string>>;

function validateDriverBackend(driver: Driver): DriverValidationErrors {
  const nameRegex = /^[A-Za-z\s\-']+$/;
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  const errors: DriverValidationErrors = {};
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
    const clientData = req.body;
    console.log('Received client data with co_applicant:', !!clientData.co_applicant);
    
    // Extract co_applicant data
    const coApplicantData = clientData.co_applicant;
    console.log('Co-applicant include_coapplicant:', coApplicantData?.include_coapplicant);
    
    let coApplicantId = null;
    
    // Step 1: We'll create co_applicant AFTER client is created to avoid client_id requirement issue
    
    // Step 2: Create applicant
    let applicantId = null;
    if (clientData.applicant) {
      try {
        console.log('Creating applicant...');
        const applicant = new Applicant(clientData.applicant);
        const savedApplicant = await applicant.save();
        applicantId = savedApplicant._id;
        console.log('✅ Applicant created with ID:', applicantId);
      } catch (applicantError) {
        console.error('❌ Error creating applicant:', applicantError);
        // Clean up co-applicant if it was created
        if (coApplicantId) {
          await CoApplicant.findByIdAndDelete(coApplicantId);
        }
        throw applicantError;
      }
    }
    
    // Step 3: Create the main client document
    const clientDoc = {
      entry_date: clientData.entry_date,
      status: clientData.status || 'Active',
      payoff_amount: clientData.payoff_amount,
      consultant_name: clientData.consultant_name,
      processor_name: clientData.processor_name,
      // Reference the created documents
      applicant: applicantId,
      co_applicant: coApplicantId,
      household_members: clientData.household_members,
      drivers: clientData.drivers || [], // <-- Add this line to save drivers
    };
    
    console.log('Client document to save:', {
      ...clientDoc,
      co_applicant: coApplicantId ? `ObjectId(${coApplicantId})` : null
    });
    
    const client = new Client(clientDoc);
    const savedClient = await client.save();
    console.log('✅ Client created with ID:', savedClient._id);
    
    // Step 3.5: Now create co-applicant with the client_id
    if (coApplicantData && coApplicantData.include_coapplicant) {
      try {
        console.log('Creating co-applicant with CoApplicant model...');
        
        // Create the co-applicant document using CoApplicant model
        const coApplicantDoc = {
          client_id: savedClient._id, // Now we have the client_id!
          include_coapplicant: coApplicantData.include_coapplicant,
          name_information: coApplicantData.name_information,
          current_address: coApplicantData.current_address,
          previous_address: coApplicantData.previous_address,
          employment: coApplicantData.employment,
          previous_employment: coApplicantData.previous_employment,
          credit_scores: coApplicantData.credit_scores,
          household_members: coApplicantData.household_members || [],
          demographics_information: {
            dob: coApplicantData.date_of_birth,
            birth_place: coApplicantData.birth_place,
            marital_status: coApplicantData.marital_status,
            race: coApplicantData.race,
            anniversary: coApplicantData.anniversary,
            spouse_name: coApplicantData.spouse_name,
            spouse_occupation: coApplicantData.spouse_occupation,
            number_of_dependents: coApplicantData.number_of_dependents,
          },
          contact: coApplicantData.contact,
          fax: coApplicantData.fax,
          entry_date: new Date(),
          created_at: new Date(),
        };
        
        console.log('CoApplicant data to save with client_id:', savedClient._id);
        
        const coApplicant = new CoApplicant(coApplicantDoc);
        const savedCoApplicant = await coApplicant.save();
        coApplicantId = savedCoApplicant._id;
        console.log('✅ Co-applicant created successfully with ID:', coApplicantId);
        
        // Update the client with co_applicant reference
        await Client.findByIdAndUpdate(savedClient._id, { co_applicant: coApplicantId });
        console.log('✅ Updated client with co_applicant reference');
        
      } catch (coApplicantError :  any) {
        console.error('❌ Error creating co-applicant:', coApplicantError);
        const err = coApplicantError as Error;
        console.error('CoApplicant error details:', err.message);
        if ('errors' in coApplicantError) {
          console.error('Validation errors:', (coApplicantError as any).errors);
        }
        // Continue without co-applicant rather than failing the entire process
      }
    } else {
      console.log('Skipping co-applicant creation - include_coapplicant:', coApplicantData?.include_coapplicant);
    }
    
    // Step 4: Create related documents and link them to the client
    const relatedIds: {
      liabilities?: any[];
      first_mortgage?: any;
      second_mortgage?: any;
      proposed_first_loan?: any;
      proposed_second_loan?: any;
    } = {};
    
    // Create liabilities
    if (clientData.liabilities && Array.isArray(clientData.liabilities)) {
      const liabilityPromises = clientData.liabilities.map(async (liability: any) => {
        const liabilityDoc = new Liability({
          ...liability,
          client_id: savedClient._id
        });
        return await liabilityDoc.save();
      });
      const savedLiabilities = await Promise.all(liabilityPromises);
      relatedIds.liabilities = savedLiabilities.map((l: any) => l._id);
    }
    
    // Create mortgages
    if (clientData.mortgage) {
      const mortgageData = clientData.mortgage;
      
      // First mortgage
      if (mortgageData.first_mortgage_balance) {
        const firstMortgage = new Mortgage({
          client_id: savedClient._id,
          type: 'first',
          address: mortgageData.address,
          city: mortgageData.city,
          state: mortgageData.state,
          zip_code: mortgageData.zip_code,
          occupancy_type: mortgageData.occupancy_type,
          balance: mortgageData.first_mortgage_balance,
          rate: mortgageData.first_mortgage_rate,
          term: mortgageData.first_mortgage_term,
          payment: mortgageData.first_mortgage_payment,
          lienholder: mortgageData.lienholder_1
        });
        const savedFirstMortgage = await firstMortgage.save();
        relatedIds.first_mortgage = savedFirstMortgage._id;
      }
      
      // Second mortgage
      if (mortgageData.second_mortgage_balance) {
        const secondMortgage = new Mortgage({
          client_id: savedClient._id,
          type: 'second',
          balance: mortgageData.second_mortgage_balance,
          rate: mortgageData.second_mortgage_rate,
          term: mortgageData.second_mortgage_term,
          payment: mortgageData.second_mortgage_payment,
          lienholder: mortgageData.lienholder_2
        });
        const savedSecondMortgage = await secondMortgage.save();
        relatedIds.second_mortgage = savedSecondMortgage._id;
      }
      
      // Proposed loans (using Mortgage model with type field)
      if (mortgageData.first_loan_amount) {
        const proposedFirst = new Mortgage({
          client_id: savedClient._id,
          type: 'proposed_first',
          amount: mortgageData.first_loan_amount,
          rate: mortgageData.first_loan_rate,
          term: mortgageData.first_loan_term,
          new_payment: mortgageData.first_loan_new_payment
        });
        const savedProposedFirst = await proposedFirst.save();
        relatedIds.proposed_first_loan = savedProposedFirst._id;
      }
      
      if (mortgageData.second_loan_amount) {
        const proposedSecond = new Mortgage({
          client_id: savedClient._id,
          type: 'proposed_second',
          amount: mortgageData.second_loan_amount,
          rate: mortgageData.second_loan_rate,
          term: mortgageData.second_loan_term,
          new_payment: mortgageData.second_loan_new_payment
        });
        const savedProposedSecond = await proposedSecond.save();
        relatedIds.proposed_second_loan = savedProposedSecond._id;
      }
    }
    
    // Create underwriting
    if (clientData.underwriting) {
      const underwriting = new Underwriting({
        ...clientData.underwriting,
        client_id: savedClient._id
      });
      await underwriting.save();
    }
    
    // Update client with loan status and related IDs
    if (clientData.loanStatus || Object.keys(relatedIds).length > 0) {
      const updateData: any = {};
      if (clientData.loanStatus) {
        updateData.loanStatus = clientData.loanStatus;
      }
      Object.assign(updateData, relatedIds);
      
      await Client.findByIdAndUpdate(savedClient._id, updateData, { new: true });
    }
    
    // Step 5: Return the created client with populated data
    console.log('Fetching final client with populations...');
    
    // First, let's check what's actually in the database
    const rawClient = await Client.findById(savedClient._id).lean();
    console.log('Raw client co_applicant field after update:', rawClient?.co_applicant);
    
    const populatedClient = await Client.findById(savedClient._id)
      .populate('applicant')
      .populate({
        path: 'co_applicant',
        model: 'CoApplicant' // Explicitly specify the model
      })
      .populate('liabilities')
      .populate('first_mortgage')
      .populate('second_mortgage')
      .populate('proposed_first_loan')
      .populate('proposed_second_loan');
    
    console.log('Final populated client co_applicant:', populatedClient?.co_applicant ? 'EXISTS' : 'NULL');
    if (populatedClient?.co_applicant) {
      console.log('Co_applicant include_coapplicant:', (populatedClient.co_applicant as any).include_coapplicant);
    }
    
    return res.status(201).json({
      success: true,
      data: populatedClient
    });
    
  } catch (error) {
    const err = error as Error;
    console.error('❌ Error creating client:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
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
      .populate({
        path: 'co_applicant',
        model: 'CoApplicant' // Add explicit model reference like other functions
      });
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
        applicant: client.applicant,
        co_applicant: client.co_applicant,
        liabilities: client.liabilities,
        drivers: client.drivers,
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
    const { id } = req.params;
    let client;
    
    // Check if the ID is a valid ObjectId format
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      // If it's a valid ObjectId, search by _id
      client = await Client.findById(id)
        .populate('applicant')
        .populate({
          path: 'co_applicant',
          model: 'CoApplicant' // Explicit model reference
        })
        .populate('liabilities')
        .populate('first_mortgage')
        .populate('second_mortgage')
        .populate('proposed_first_loan')
        .populate('proposed_second_loan')
        .populate('drivers')
        .lean();
    } else {
      // If it's not a valid ObjectId, search by client_id
      client = await Client.findOne({ client_id: id })
        .populate('applicant')
        .populate({
          path: 'co_applicant',
          model: 'CoApplicant' // Explicit model reference
        })
        .populate('liabilities')
        .populate('first_mortgage')
        .populate('second_mortgage')
        .populate('proposed_first_loan')
        .populate('proposed_second_loan')
        .populate('drivers')
        .lean();
    }
    
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found',
        searchedId: id
      });
    }
    
    // Debug: Log the populated co_applicant
    console.log('Raw client co_applicant field:', client.co_applicant);
    console.log('Populated co_applicant:', client.co_applicant ? 'EXISTS' : 'NULL');
    
    // Get underwriting data if it exists
    let underwritingData = null;
    try {
      underwritingData = await Underwriting.findOne({ client_id: client._id })
        .lean();
    } catch (error) {
      console.log('Error fetching underwriting data for client:', client._id, error);
    }
    
    // Combine all data - ensure we return everything
    const responseData = {
      ...client,
      underwriting: underwritingData,
      co_applicant: client.co_applicant, // This should now be populated
      // Ensure all arrays are included even if empty
      liabilities: client.liabilities || [],
      drivers: client.drivers || [],
      // Add metadata with debug info
      _metadata: {
        searchedBy: /^[a-fA-F0-9]{24}$/.test(id) ? '_id' : 'client_id',
        searchedValue: id,
        hasUnderwriting: !!underwritingData,
        retrievedAt: new Date().toISOString(),
        debug: {
          coApplicantPopulated: !!client.co_applicant,
          coApplicantType: typeof client.co_applicant,
          coApplicantIncludeFlag: client.co_applicant ? (client.co_applicant as any).include_coapplicant : null
        }
      }
    };
    
    return res.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    const err = error as Error;
    console.error('Error in getClientById:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
      const applicantUpdate = { ...req.body.applicant };
      // Move demographic fields into demographics_information if present at root
      const demographics_information = {
        birth_place: applicantUpdate.birth_place,
        dob: applicantUpdate.date_of_birth,
        marital_status: applicantUpdate.marital_status,
        race: applicantUpdate.race,
        anniversary: applicantUpdate.anniversary,
        spouse_name: applicantUpdate.spouse_name,
        spouse_occupation: applicantUpdate.spouse_occupation,
        number_of_dependents: applicantUpdate.number_of_dependents
      };
      // Remove from root
      delete applicantUpdate.birth_place;
      delete applicantUpdate.date_of_birth;
      delete applicantUpdate.marital_status;
      delete applicantUpdate.race;
      delete applicantUpdate.anniversary;
      delete applicantUpdate.spouse_name;
      delete applicantUpdate.spouse_occupation;
      delete applicantUpdate.number_of_dependents;
      applicantUpdate.demographics_information = demographics_information;
      // Map employment fields for update
      if (applicantUpdate.employment) {
        applicantUpdate.current_employment = {
          ...applicantUpdate.employment,
          monthly_salary: applicantUpdate.employment.gross_monthly_salary || applicantUpdate.employment.monthly_salary,
          additional_income: applicantUpdate.employment.additional_income,
          source: applicantUpdate.employment.source
        };
        delete applicantUpdate.employment;
      }
      // Map current_address and ensure fax is set from applicantUpdate.current_address if present
      if (applicantUpdate.current_address) {
        if (typeof applicantUpdate.current_address.fax !== 'undefined') {
          applicantUpdate.current_address.fax = applicantUpdate.current_address.fax;
        } else if (applicantUpdate.contact && typeof applicantUpdate.contact.fax !== 'undefined') {
          applicantUpdate.current_address.fax = applicantUpdate.contact.fax;
        }
      }
      if (client.applicant) {
        await Applicant.findByIdAndUpdate(client.applicant, applicantUpdate, { new: true });
      } else {
        const newApplicant = await Applicant.create(applicantUpdate);
        client.applicant = newApplicant._id;
      }
    }

    // 2. Co-Applicant - Enhanced logic for proper handling
    if (req.body.co_applicant) {
      const coApplicantData = req.body.co_applicant;
      
      if (coApplicantData.include_coapplicant) {
        // Map the data structure to match CoApplicant schema
        const coApplicantUpdate = {
          include_coapplicant: true,
          name_information: coApplicantData.name_information,
          current_address: coApplicantData.current_address,
          previous_address: coApplicantData.previous_address,
          employment: coApplicantData.employment,
          previous_employment: coApplicantData.previous_employment,
          credit_scores: coApplicantData.credit_scores,
          household_members: coApplicantData.household_members || [],
          demographics_information: {
            dob: coApplicantData.date_of_birth,
            birth_place: coApplicantData.birth_place,
            marital_status: coApplicantData.marital_status,
            race: coApplicantData.race,
            anniversary: coApplicantData.anniversary,
            spouse_name: coApplicantData.spouse_name,
            spouse_occupation: coApplicantData.spouse_occupation,
            number_of_dependents: coApplicantData.number_of_dependents,
          },
          contact: coApplicantData.contact,
          fax: coApplicantData.fax,
        };

        if (client.co_applicant) {
          // Update existing co_applicant
          await CoApplicant.findByIdAndUpdate(client.co_applicant, coApplicantUpdate, { new: true });
          console.log('UpdateClient - Updated existing co_applicant');
        } else {
          // Create new co_applicant
          const newCoApplicant = await CoApplicant.create({
            ...coApplicantUpdate,
            client_id: client._id
          });
          client.co_applicant = newCoApplicant._id;
          console.log('UpdateClient - Created new co_applicant');
        }
      } else {
        // User wants to remove/disable co_applicant
        if (client.co_applicant) {
          await CoApplicant.findByIdAndUpdate(client.co_applicant, {
            include_coapplicant: false
          });
          console.log('UpdateClient - Disabled co_applicant');
        }
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
              amount: m.first_mortgage_amount,
              balance: m.first_mortgage_balance,
              rate: m.first_mortgage_rate,
              term: m.first_mortgage_term,
              payment: m.first_mortgage_payment,
              lienholder: m.lienholder_1,
              int_term: m.first_mortgage_int_term,
              new_payment: m.first_mortgage_new_payment
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
            amount: m.first_mortgage_amount,
            balance: m.first_mortgage_balance,
            rate: m.first_mortgage_rate,
            term: m.first_mortgage_term,
            payment: m.first_mortgage_payment,
            lienholder: m.lienholder_1,
            int_term: m.first_mortgage_int_term,
            new_payment: m.first_mortgage_new_payment
          });
          client.first_mortgage = firstMortgage._id;
        }
      }
      // Second Mortgage
      if (m.second_mortgage_balance || m.second_mortgage_rate || m.second_mortgage_term || m.second_mortgage_payment || m.lienholder_2) {
        if (client.second_mortgage) {
          await Mortgage.findByIdAndUpdate(client.second_mortgage, {
            address: m.second_address,
            city: m.second_city,
            state: m.second_state,
            zip_code: m.second_zip_code,
            occupancy_type: m.second_occupancy_type,
            amount: m.second_mortgage_amount,
            balance: m.second_mortgage_balance,
            rate: m.second_mortgage_rate,
            term: m.second_mortgage_term,
            payment: m.second_mortgage_payment,
            lienholder: m.lienholder_2,
            int_term: m.second_mortgage_int_term,
            new_payment: m.second_mortgage_new_payment
          });
        } else {
          const secondMortgage = await Mortgage.create({
            client_id: client._id,
            type: 'second',
            address: m.second_address,
            city: m.second_city,
            state: m.second_state,
            zip_code: m.second_zip_code,
            occupancy_type: m.second_occupancy_type,
            amount: m.second_mortgage_amount,
            balance: m.second_mortgage_balance,
            rate: m.second_mortgage_rate,
            term: m.second_mortgage_term,
            payment: m.second_mortgage_payment,
            lienholder: m.lienholder_2,
            int_term: m.second_mortgage_int_term,
            new_payment: m.second_mortgage_new_payment
          });
          client.second_mortgage = secondMortgage._id;
        }
      }
      // Proposed First Loan
      if (m.first_loan_amount || m.first_loan_rate || m.first_loan_term || m.first_loan_new_payment) {
        if (client.proposed_first_loan) {
          await Mortgage.findByIdAndUpdate(client.proposed_first_loan, {
            address: m.proposed_first_address,
            city: m.proposed_first_city,
            state: m.proposed_first_state,
            zip_code: m.proposed_first_zip_code,
            occupancy_type: m.proposed_first_occupancy_type,
            amount: m.first_loan_amount,
            balance: m.proposed_first_balance,
            rate: m.first_loan_rate,
            term: m.first_loan_term,
            payment: m.proposed_first_payment,
            lienholder: m.proposed_first_lienholder,
            int_term: m.first_loan_int_term,
            new_payment: m.first_loan_new_payment
          });
        } else {
          const proposedFirstLoan = await Mortgage.create({
            client_id: client._id,
            type: 'proposed_first',
            address: m.proposed_first_address,
            city: m.proposed_first_city,
            state: m.proposed_first_state,
            zip_code: m.proposed_first_zip_code,
            occupancy_type: m.proposed_first_occupancy_type,
            amount: m.first_loan_amount,
            balance: m.proposed_first_balance,
            rate: m.first_loan_rate,
            term: m.first_loan_term,
            payment: m.proposed_first_payment,
            lienholder: m.proposed_first_lienholder,
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
            address: m.proposed_second_address,
            city: m.proposed_second_city,
            state: m.proposed_second_state,
            zip_code: m.proposed_second_zip_code,
            occupancy_type: m.proposed_second_occupancy_type,
            amount: m.second_loan_amount,
            balance: m.proposed_second_balance,
            rate: m.second_loan_rate,
            term: m.second_loan_term,
            payment: m.proposed_second_payment,
            lienholder: m.proposed_second_lienholder,
            int_term: m.second_loan_int_term,
            new_payment: m.second_loan_new_payment
          });
      } else {
          const proposedSecondLoan = await Mortgage.create({
            client_id: client._id,
            type: 'proposed_second',
            address: m.proposed_second_address,
            city: m.proposed_second_city,
            state: m.proposed_second_state,
            zip_code: m.proposed_second_zip_code,
            occupancy_type: m.proposed_second_occupancy_type,
            amount: m.second_loan_amount,
            balance: m.proposed_second_balance,
            rate: m.second_loan_rate,
            term: m.second_loan_term,
            payment: m.proposed_second_payment,
            lienholder: m.proposed_second_lienholder,
            int_term: m.second_loan_int_term,
            new_payment: m.second_loan_new_payment
          });
          client.proposed_second_loan = proposedSecondLoan._id;
        }
      }
    }

    // 5. Underwriting
    if (req.body.underwriting) {
      const uw = { ...req.body.underwriting };
      if (uw._id) {
        // Update existing underwriting by _id
        await Underwriting.findByIdAndUpdate(uw._id, uw, { new: true });
        client.underwriting = uw._id;
      } else {
        // Remove _id if present (shouldn't be, but just in case)
        delete uw._id;
        // Create new underwriting
        const newUw = await Underwriting.create({ ...uw, client_id: client._id });
        client.underwriting = newUw._id;
      }
    }

    // 6. Loan Status
    if (req.body.loanStatus) {
      client.loanStatus = req.body.loanStatus;
    }

    // Save client
    if (req.body.drivers) {
      client.drivers = req.body.drivers;
    }
    await client.save();
    
    console.log('UpdateClient - Populating client data');
    const populatedClientUpdate = await Client.findById(client._id)
      .populate('applicant')
      .populate({
        path: 'co_applicant',
        model: 'CoApplicant' // Add explicit model reference
      })
      .populate('liabilities')
      .populate('first_mortgage')
      .populate('second_mortgage')
      .populate('proposed_first_loan')
      .populate('proposed_second_loan');
    console.log('UpdateClient - Client populated successfully');
    
    if (!populatedClientUpdate) {
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
        ...populatedClientUpdate.toObject(),
        underwriting: underwritingData,
        co_applicant: populatedClientUpdate.co_applicant || { include_coapplicant: false }
      };
      console.log('UpdateClient - Response data prepared successfully');
      console.log('UpdateClient - Co_applicant populated:', !!populatedClientUpdate.co_applicant);
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

