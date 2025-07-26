export interface ValidationErrors {
  [key: string]: string;
}

export interface DriverValidationErrors {
  fullName?: string;
  dateOfBirth?: string;
  age?: string;
  relationship?: string;
  ssn?: string;
  sex?: string;
  maritalStatus?: string;
  drivingStatus?: string;
  licenseNumber?: string;
  state?: string;
  accidentsViolations?: string;
  [key: string]: string | undefined;
}

export class ValidationService {
  static validateDriver(driver: any): DriverValidationErrors {
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

  static validateClient(clientData: any): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!clientData.consultant_name) {
      errors.consultant_name = 'Consultant name is required.';
    }
    
    if (!clientData.processor_name) {
      errors.processor_name = 'Processor name is required.';
    }
    
    if (clientData.payoff_amount !== undefined && (isNaN(clientData.payoff_amount) || clientData.payoff_amount < 0)) {
      errors.payoff_amount = 'Payoff amount must be a positive number.';
    }
    
    if (clientData.status && !['Active', 'Pending', 'Inactive'].includes(clientData.status)) {
      errors.status = 'Status must be Active, Pending, or Inactive.';
    }
    
    return errors;
  }

  static validateApplicant(applicantData: any): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!applicantData.name_information?.first_name) {
      errors.first_name = 'First name is required.';
    }
    
    if (!applicantData.name_information?.last_name) {
      errors.last_name = 'Last name is required.';
    }
    
    if (!applicantData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required.';
    }
    
    if (!applicantData.ssn) {
      errors.ssn = 'SSN is required.';
    }
    
    return errors;
  }

  static validateCoApplicant(coApplicantData: any): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (coApplicantData.include_coapplicant) {
      if (!coApplicantData.name_information?.first_name) {
        errors.first_name = 'First name is required for co-applicant.';
      }
      
      if (!coApplicantData.name_information?.last_name) {
        errors.last_name = 'Last name is required for co-applicant.';
      }
      
      if (!coApplicantData.date_of_birth) {
        errors.date_of_birth = 'Date of birth is required for co-applicant.';
      }
      
      if (!coApplicantData.ssn) {
        errors.ssn = 'SSN is required for co-applicant.';
      }
    }
    
    return errors;
  }

  static validateLiabilities(liabilities: any[]): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!Array.isArray(liabilities)) {
      errors.liabilities = 'Liabilities must be an array.';
      return errors;
    }
    
    liabilities.forEach((liability, index) => {
      if (!liability.creditor_name) {
        errors[`liabilities[${index}].creditor_name`] = 'Creditor name is required.';
      }
      
      if (liability.current_balance !== undefined && (isNaN(liability.current_balance) || liability.current_balance < 0)) {
        errors[`liabilities[${index}].current_balance`] = 'Current balance must be a positive number.';
      }
    });
    
    return errors;
  }

  static validateMortgages(mortgages: any[]): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!Array.isArray(mortgages)) {
      errors.mortgages = 'Mortgages must be an array.';
      return errors;
    }
    
    mortgages.forEach((mortgage, index) => {
      if (!mortgage.lender_name) {
        errors[`mortgages[${index}].lender_name`] = 'Lender name is required.';
      }
      
      if (mortgage.loan_amount !== undefined && (isNaN(mortgage.loan_amount) || mortgage.loan_amount < 0)) {
        errors[`mortgages[${index}].loan_amount`] = 'Loan amount must be a positive number.';
      }
    });
    
    return errors;
  }

  static hasErrors(validationErrors: ValidationErrors): boolean {
    return Object.keys(validationErrors).length > 0;
  }
} 