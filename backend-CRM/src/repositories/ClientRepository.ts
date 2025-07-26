import { Types } from 'mongoose';
import { Client, Applicant, CoApplicant, Liability, Mortgage, Underwriting, Driver } from '../models';

export interface IClientRepository {
  createClient(clientData: any, session: any): Promise<any>;
  findClientById(id: string): Promise<any>;
  findClientByClientId(clientId: string): Promise<any>;
  findAllClients(): Promise<any[]>;
  updateClient(clientId: string, updateData: any, session: any): Promise<any>;
  deleteClient(clientId: string, session: any): Promise<void>;
  createApplicant(applicantData: any, session: any): Promise<any>;
  createCoApplicant(coApplicantData: any, session: any): Promise<any>;
  createLiabilities(liabilitiesData: any[], clientId: Types.ObjectId, session: any): Promise<any[]>;
  createMortgages(mortgagesData: any[], clientId: Types.ObjectId, session: any): Promise<any[]>;
  createUnderwriting(underwritingData: any, clientId: Types.ObjectId, session: any): Promise<any>;
  createDrivers(driversData: any[], clientId: Types.ObjectId, session: any): Promise<any[]>;
  updateApplicant(applicantId: Types.ObjectId, updateData: any, session: any): Promise<any>;
  updateCoApplicant(coApplicantId: Types.ObjectId, updateData: any, session: any): Promise<any>;
  updateLiabilities(clientId: Types.ObjectId, liabilitiesData: any[], session: any): Promise<any[]>;
  updateMortgages(clientId: Types.ObjectId, mortgagesData: any[], session: any): Promise<any[]>;
  updateUnderwriting(underwritingId: Types.ObjectId, updateData: any, session: any): Promise<any>;
  updateDrivers(clientId: Types.ObjectId, driversData: any[], session: any): Promise<any[]>;
  deleteRelatedDocuments(clientId: Types.ObjectId, session: any): Promise<void>;
}

export class ClientRepository implements IClientRepository {
  async createClient(clientData: any, session: any): Promise<any> {
    const client = new Client(clientData);
    return await client.save({ session });
  }

  async findClientById(id: string): Promise<any> {
    return await Client.findById(id)
      .populate('applicant')
      .populate('co_applicant')
      .populate('liabilities')
      .populate('mortgages')
      .populate('underwriting')
      .populate('drivers')
      .populate('chm')
      .populate('tud')
      .populate('loan_details')
      .populate('loan_options')
      .lean();
  }

  async findClientByClientId(clientId: string): Promise<any> {
    return await Client.findOne({ client_id: clientId })
      .populate('applicant')
      .populate('co_applicant')
      .populate('liabilities')
      .populate('mortgages')
      .populate('underwriting')
      .populate('drivers')
      .populate('chm')
      .populate('tud')
      .populate('loan_details')
      .populate('loan_options')
      .lean();
  }

  async findAllClients(): Promise<any[]> {
    return await Client.find()
      .populate('applicant')
      .populate('co_applicant')
      .populate('liabilities')
      .populate('mortgages')
      .populate('underwriting')
      .populate('drivers')
      .lean();
  }

  async updateClient(clientId: string, updateData: any, session: any): Promise<any> {
    return await Client.findByIdAndUpdate(
      clientId,
      updateData,
      { new: true, session }
    );
  }

  async deleteClient(clientId: string, session: any): Promise<void> {
    await Client.findByIdAndDelete(clientId, { session });
  }

  async createApplicant(applicantData: any, session: any): Promise<any> {
    const applicant = new Applicant(applicantData);
    return await applicant.save({ session });
  }

  async createCoApplicant(coApplicantData: any, session: any): Promise<any> {
    const coApplicant = new CoApplicant(coApplicantData);
    return await coApplicant.save({ session });
  }

  async createLiabilities(liabilitiesData: any[], clientId: Types.ObjectId, session: any): Promise<any[]> {
    const liabilityPromises = liabilitiesData.map(async (liability: any) => {
      const liabilityDoc = new Liability({
        ...liability,
        client_id: clientId
      });
      return await liabilityDoc.save({ session });
    });
    return await Promise.all(liabilityPromises);
  }

  async createMortgages(mortgagesData: any[], clientId: Types.ObjectId, session: any): Promise<any[]> {
    const mortgagePromises = mortgagesData.map(async (mortgage: any) => {
      const mortgageDoc = new Mortgage({
        ...mortgage,
        client_id: clientId
      });
      return await mortgageDoc.save({ session });
    });
    return await Promise.all(mortgagePromises);
  }

  async createUnderwriting(underwritingData: any, clientId: Types.ObjectId, session: any): Promise<any> {
    const underwriting = new Underwriting({
      ...underwritingData,
      client_id: clientId
    });
    return await underwriting.save({ session });
  }

  async createDrivers(driversData: any[], clientId: Types.ObjectId, session: any): Promise<any[]> {
    const driverPromises = driversData.map(async (driver: any) => {
      const driverDoc = new Driver({
        ...driver,
        client_id: clientId
      });
      return await driverDoc.save({ session });
    });
    return await Promise.all(driverPromises);
  }

  async updateApplicant(applicantId: Types.ObjectId, updateData: any, session: any): Promise<any> {
    return await Applicant.findByIdAndUpdate(
      applicantId,
      updateData,
      { new: true, session }
    );
  }

  async updateCoApplicant(coApplicantId: Types.ObjectId, updateData: any, session: any): Promise<any> {
    return await CoApplicant.findByIdAndUpdate(
      coApplicantId,
      updateData,
      { new: true, session }
    );
  }

  async updateLiabilities(clientId: Types.ObjectId, liabilitiesData: any[], session: any): Promise<any[]> {
    // Delete existing liabilities
    await Liability.deleteMany({ client_id: clientId }, { session });
    
    // Create new liabilities
    if (liabilitiesData.length > 0) {
      return await this.createLiabilities(liabilitiesData, clientId, session);
    }
    return [];
  }

  async updateMortgages(clientId: Types.ObjectId, mortgagesData: any[], session: any): Promise<any[]> {
    // Delete existing mortgages
    await Mortgage.deleteMany({ client_id: clientId }, { session });
    
    // Create new mortgages
    if (mortgagesData.length > 0) {
      return await this.createMortgages(mortgagesData, clientId, session);
    }
    return [];
  }

  async updateUnderwriting(underwritingId: Types.ObjectId, updateData: any, session: any): Promise<any> {
    return await Underwriting.findByIdAndUpdate(
      underwritingId,
      updateData,
      { new: true, session }
    );
  }

  async updateDrivers(clientId: Types.ObjectId, driversData: any[], session: any): Promise<any[]> {
    // Delete existing drivers
    await Driver.deleteMany({ client_id: clientId }, { session });
    
    // Create new drivers
    if (driversData.length > 0) {
      return await this.createDrivers(driversData, clientId, session);
    }
    return [];
  }

  async deleteRelatedDocuments(clientId: Types.ObjectId, session: any): Promise<void> {
    await Applicant.deleteMany({ client_id: clientId }, { session });
    await CoApplicant.deleteMany({ client_id: clientId }, { session });
    await Liability.deleteMany({ client_id: clientId }, { session });
    await Mortgage.deleteMany({ client_id: clientId }, { session });
    await Driver.deleteMany({ client_id: clientId }, { session });
    await Underwriting.deleteMany({ client_id: clientId }, { session });
  }
} 