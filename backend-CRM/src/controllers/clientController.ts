import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';
import { ValidationService } from '../services/ValidationService';

type DriverValidationErrors = Partial<Record<keyof any, string>>;

function validateDriverBackend(driver: any): DriverValidationErrors {
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
    const clientService = new ClientService();
    const result = await clientService.createClient(req.body);
    
    return res.status(201).json(result);
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
    const clientService = new ClientService();
    const clients = await clientService.getClients();
    
    return res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching clients:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const searchClients = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }

    const clientService = new ClientService();
    const clients = await clientService.getClients();
    
    // Filter clients based on search query
    const filteredClients = clients.filter(client => {
      const searchTerm = query.toLowerCase();
      
      // Search in client_id
      if (client.client_id?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in consultant_name
      if (client.consultant_name?.toLowerCase().includes(searchTerm)) return true;
      
      // Search in applicant name
      const applicantName = [
        client.applicant?.name_information?.first_name,
        client.applicant?.name_information?.last_name
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (applicantName.includes(searchTerm)) return true;
      
      // Search in co-applicant name
      if (client.co_applicant) {
        const coApplicantName = [
          client.co_applicant?.name_information?.first_name,
          client.co_applicant?.name_information?.last_name
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (coApplicantName.includes(searchTerm)) return true;
      }
      
      return false;
    });

    return res.status(200).json({
      success: true,
      data: filteredClients
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error searching clients:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientService = new ClientService();
    const client = await clientService.getClientById(id);
    
    return res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching client:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientService = new ClientService();
    const result = await clientService.updateClient(id, req.body);
    
    return res.status(200).json(result);
  } catch (error) {
    const err = error as Error;
    console.error('Error updating client:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientService = new ClientService();
    await clientService.deleteClient(id);
    
    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error deleting client:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientService = new ClientService();
    const loanStatus = await clientService.getLoanStatus(id);
    
    return res.status(200).json({
      success: true,
      data: loanStatus
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching loan status:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loanStatus } = req.body;
    const clientService = new ClientService();
    const result = await clientService.updateLoanStatus(id, loanStatus);
    
    return res.status(200).json(result);
  } catch (error) {
    const err = error as Error;
    console.error('Error updating loan status:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const createLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { loanStatus } = req.body;
    const clientService = new ClientService();
    const result = await clientService.createLoanStatus(id, loanStatus);
    
    return res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    console.error('Error creating loan status:', err);
    
    if (err.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

