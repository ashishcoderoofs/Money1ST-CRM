import mongoose from 'mongoose';
import { IClientRepository } from '../repositories/ClientRepository';
import { ClientRepository } from '../repositories/ClientRepository';

export interface IClientService {
  createClient(clientData: any): Promise<any>;
  getClients(): Promise<any[]>;
  getClientById(id: string): Promise<any>;
  updateClient(id: string, updateData: any): Promise<any>;
  deleteClient(id: string): Promise<void>;
  getLoanStatus(id: string): Promise<any>;
  updateLoanStatus(id: string, loanStatus: any): Promise<any>;
  createLoanStatus(id: string, loanStatus: any): Promise<any>;
}

export class ClientService implements IClientService {
  private repository: IClientRepository;

  constructor(repository: IClientRepository = new ClientRepository()) {
    this.repository = repository;
  }

  async createClient(clientData: any): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log('Creating client with new normalized schema...');

      // Step 1: Create Applicant
      let applicantId = null;
      if (clientData.applicant) {
        console.log('Creating applicant...');
        const applicant = await this.repository.createApplicant(clientData.applicant, session);
        applicantId = applicant._id;
        console.log('✅ Applicant created with ID:', applicantId);
      }

      // Step 2: Create Co-Applicant (if needed)
      let coApplicantId = null;
      if (clientData.co_applicant && clientData.co_applicant.include_coapplicant) {
        console.log('Creating co-applicant...');
        const coApplicant = await this.repository.createCoApplicant(clientData.co_applicant, session);
        coApplicantId = coApplicant._id;
        console.log('✅ Co-applicant created with ID:', coApplicantId);
      }

      // Step 3: Create Client with references
      const clientDoc = {
        entry_date: clientData.entry_date || new Date(),
        status: clientData.status || 'Active',
        payoff_amount: clientData.payoff_amount || 0,
        consultant_name: clientData.consultant_name,
        processor_name: clientData.processor_name,
        applicant: applicantId,
        co_applicant: coApplicantId,
      };

      const savedClient = await this.repository.createClient(clientDoc, session);
      console.log('✅ Client created with ID:', savedClient._id);

      // Step 4: Create related documents
      const relatedIds: {
        liabilities?: any[];
        mortgages?: any[];
        underwriting?: any;
        drivers?: any[];
      } = {};

      // Create liabilities
      if (clientData.liabilities && Array.isArray(clientData.liabilities)) {
        const savedLiabilities = await this.repository.createLiabilities(
          clientData.liabilities,
          savedClient._id,
          session
        );
        relatedIds.liabilities = savedLiabilities.map((l: any) => l._id);
      }

      // Create mortgages
      if (clientData.mortgages && Array.isArray(clientData.mortgages)) {
        const savedMortgages = await this.repository.createMortgages(
          clientData.mortgages,
          savedClient._id,
          session
        );
        relatedIds.mortgages = savedMortgages.map((m: any) => m._id);
      }

      // Create underwriting
      if (clientData.underwriting) {
        const savedUnderwriting = await this.repository.createUnderwriting(
          clientData.underwriting,
          savedClient._id,
          session
        );
        relatedIds.underwriting = savedUnderwriting._id;
      }

      // Create drivers
      if (clientData.drivers && Array.isArray(clientData.drivers)) {
        const savedDrivers = await this.repository.createDrivers(
          clientData.drivers,
          savedClient._id,
          session
        );
        relatedIds.drivers = savedDrivers.map((d: any) => d._id);
      }

      // Update client with related IDs
      if (Object.keys(relatedIds).length > 0) {
        await this.repository.updateClient(savedClient._id.toString(), relatedIds, session);
      }

      // Commit transaction
      await session.commitTransaction();
      console.log('✅ Transaction committed successfully');

      // Step 5: Return populated client data
      const populatedClient = await this.repository.findClientById(savedClient._id.toString());

      return {
        success: true,
        data: populatedClient
      };

    } catch (error) {
      await session.abortTransaction();
      const err = error as Error;
      console.error('❌ Error creating client:', err);
      throw new Error(err.message);
    } finally {
      session.endSession();
    }
  }

  async getClients(): Promise<any[]> {
    try {
      const clients = await this.repository.findAllClients();
      
      return clients.map(client => {
        const totalDebt = client.liabilities?.reduce((sum: number, liability: any) => 
          sum + (liability.current_balance || 0), 0) || 0;
        
        return {
          ...client,
          totalDebt
        };
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching clients:', err);
      throw new Error(err.message);
    }
  }

  async getClientById(id: string): Promise<any> {
    try {
      let client;

      // Check if the ID is a valid ObjectId format
      if (/^[a-fA-F0-9]{24}$/.test(id)) {
        // If it's a valid ObjectId, search by _id
        client = await this.repository.findClientById(id);
      } else {
        // If it's not a valid ObjectId, search by client_id
        client = await this.repository.findClientByClientId(id);
      }

      if (!client) {
        throw new Error('Client not found');
      }

      return client;
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching client:', err);
      throw new Error(err.message);
    }
  }

  async updateClient(id: string, updateData: any): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the client first
      const client = await this.getClientById(id);
      if (!client) {
        throw new Error('Client not found');
      }

      // Update core client fields
      const clientUpdateData: any = {};
      if (updateData.status) clientUpdateData.status = updateData.status;
      if (updateData.payoff_amount !== undefined) clientUpdateData.payoff_amount = updateData.payoff_amount;
      if (updateData.consultant_name) clientUpdateData.consultant_name = updateData.consultant_name;
      if (updateData.processor_name) clientUpdateData.processor_name = updateData.processor_name;

      if (Object.keys(clientUpdateData).length > 0) {
        await this.repository.updateClient(client._id.toString(), clientUpdateData, session);
      }

      // Update applicant
      if (updateData.applicant && client.applicant) {
        await this.repository.updateApplicant(client.applicant._id, updateData.applicant, session);
      }

      // Update co-applicant
      if (updateData.co_applicant && client.co_applicant) {
        await this.repository.updateCoApplicant(client.co_applicant._id, updateData.co_applicant, session);
      }

      // Update liabilities
      if (updateData.liabilities) {
        await this.repository.updateLiabilities(client._id, updateData.liabilities, session);
      }

      // Update mortgages
      if (updateData.mortgages) {
        await this.repository.updateMortgages(client._id, updateData.mortgages, session);
      }

      // Update underwriting
      if (updateData.underwriting) {
        if (client.underwriting) {
          await this.repository.updateUnderwriting(client.underwriting._id, updateData.underwriting, session);
        } else {
          const newUnderwriting = await this.repository.createUnderwriting(
            updateData.underwriting,
            client._id,
            session
          );
          await this.repository.updateClient(client._id.toString(), { underwriting: newUnderwriting._id }, session);
        }
      }

      // Update drivers
      if (updateData.drivers) {
        await this.repository.updateDrivers(client._id, updateData.drivers, session);
      }

      // Update loan status
      if (updateData.loanStatus) {
        await this.repository.updateClient(client._id.toString(), { loanStatus: updateData.loanStatus }, session);
      }

      // Commit transaction
      await session.commitTransaction();

      // Return populated client data
      const populatedClient = await this.repository.findClientById(client._id.toString());

      return {
        success: true,
        data: populatedClient
      };

    } catch (error) {
      await session.abortTransaction();
      const err = error as Error;
      console.error('Error updating client:', err);
      throw new Error(err.message);
    } finally {
      session.endSession();
    }
  }

  async deleteClient(id: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const client = await this.getClientById(id);
      if (!client) {
        throw new Error('Client not found');
      }

      // Delete all related documents
      await this.repository.deleteRelatedDocuments(client._id, session);

      // Delete the client
      await this.repository.deleteClient(client._id.toString(), session);

      // Commit transaction
      await session.commitTransaction();

    } catch (error) {
      await session.abortTransaction();
      const err = error as Error;
      console.error('Error deleting client:', err);
      throw new Error(err.message);
    } finally {
      session.endSession();
    }
  }

  async getLoanStatus(id: string): Promise<any> {
    try {
      const client = await this.getClientById(id);
      return client.loanStatus || null;
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching loan status:', err);
      throw new Error(err.message);
    }
  }

  async updateLoanStatus(id: string, loanStatus: any): Promise<any> {
    try {
      const client = await this.getClientById(id);
      if (!client) {
        throw new Error('Client not found');
      }

      const updatedClient = await this.repository.updateClient(
        client._id.toString(),
        { loanStatus },
        null // No session needed for simple update
      );

      return {
        success: true,
        data: updatedClient.loanStatus
      };
    } catch (error) {
      const err = error as Error;
      console.error('Error updating loan status:', err);
      throw new Error(err.message);
    }
  }

  async createLoanStatus(id: string, loanStatus: any): Promise<any> {
    try {
      const client = await this.getClientById(id);
      if (!client) {
        throw new Error('Client not found');
      }

      const updatedClient = await this.repository.updateClient(
        client._id.toString(),
        { loanStatus },
        null // No session needed for simple update
      );

      return {
        success: true,
        data: updatedClient.loanStatus
      };
    } catch (error) {
      const err = error as Error;
      console.error('Error creating loan status:', err);
      throw new Error(err.message);
    }
  }
} 