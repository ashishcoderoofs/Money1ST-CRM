import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Complete Joi validation schema for Securia Client Creation
export const validateSecuriaClientCreation = (req: Request, res: Response, next: NextFunction): Response | void => {
  const schema = Joi.object({
    // Basic Information (Required)
    basicInfo: Joi.object({
      title: Joi.string().valid('Mr', 'Mrs', 'Ms', 'Dr', 'Prof').optional().trim(),
      firstName: Joi.string().min(2).max(50).required().trim(),
      middleInitial: Joi.string().max(1).optional().trim(),
      lastName: Joi.string().min(2).max(50).required().trim(),
      suffix: Joi.string().valid('Jr', 'Sr', 'II', 'III', 'IV').optional().trim(),
      maidenName: Joi.string().max(50).optional().trim(),
      isConsultant: Joi.boolean().optional()
    }).required(),

    // Contact Information (Required)
    contactInfo: Joi.object({
      homePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      mobilePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      otherPhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      fax: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      email: Joi.string().email().max(100).required().trim().lowercase()
    }).required().custom((value, helpers) => {
      // At least one phone number is required
      const { homePhone, mobilePhone, otherPhone } = value;
      if (!homePhone && !mobilePhone && !otherPhone) {
        return helpers.error('any.custom', { message: 'At least one phone number is required' });
      }
      return value;
    }),

    // Contact Address (Optional)
    contactAddress: Joi.object({
      address: Joi.string().max(200).optional().trim(),
      city: Joi.string().max(100).optional().trim(),
      state: Joi.string().length(2).pattern(/^[A-Z]{2}$/).optional().trim().uppercase(),
      zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional().trim(),
      howLongAtCurrentAddress: Joi.string().max(50).optional().trim()
    }).optional(),

    // Co-Applicant Information (Optional)
    coApplicant: Joi.object({
      hasCoApplicant: Joi.boolean().optional(),
      basicInfo: Joi.object({
        title: Joi.string().optional().trim(),
        firstName: Joi.string().max(50).optional().trim(),
        middleInitial: Joi.string().max(1).optional().trim(),
        lastName: Joi.string().max(50).optional().trim(),
        suffix: Joi.string().optional().trim(),
        maidenName: Joi.string().max(50).optional().trim()
      }).optional(),
      contactInfo: Joi.object({
        homePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
        mobilePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
        otherPhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
        fax: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
        email: Joi.string().email().optional().trim()
      }).optional(),
      address: Joi.object({
        address: Joi.string().max(200).optional().trim(),
        city: Joi.string().max(100).optional().trim(),
        state: Joi.string().length(2).optional().trim(),
        zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional().trim(),
        howLongAtCurrentAddress: Joi.string().max(50).optional().trim()
      }).optional()
    }).optional(),

    // Liabilities (Optional)
    liabilities: Joi.array().items(
      Joi.object({
        creditorName: Joi.string().max(100).optional().trim(),
        accountNumber: Joi.string().max(50).optional().trim(),
        balance: Joi.number().min(0).optional(),
        monthlyPayment: Joi.number().min(0).optional(),
        minimumPayment: Joi.number().min(0).optional(),
        interestRate: Joi.number().min(0).max(100).optional(),
        payoffAmount: Joi.number().min(0).optional(),
        accountType: Joi.string().valid('credit-card', 'auto-loan', 'student-loan', 'personal-loan', 'mortgage', 'other').optional(),
        status: Joi.string().valid('current', 'past-due', 'closed', 'charge-off').optional()
      })
    ).optional(),

    // Mortgages (Optional)
    mortgages: Joi.array().items(
      Joi.object({
        propertyAddress: Joi.string().max(200).optional().trim(),
        lenderName: Joi.string().max(100).optional().trim(),
        accountNumber: Joi.string().max(50).optional().trim(),
        currentBalance: Joi.number().min(0).optional(),
        monthlyPayment: Joi.number().min(0).optional(),
        interestRate: Joi.number().min(0).max(100).optional(),
        propertyValue: Joi.number().min(0).optional(),
        mortgageType: Joi.string().valid('conventional', 'fha', 'va', 'usda', 'jumbo', 'other').optional(),
        isPrimaryResidence: Joi.boolean().optional()
      })
    ).optional(),

    // Underwriting Information (Optional)
    underwriting: Joi.object({
      creditScore: Joi.number().min(300).max(850).optional(),
      annualIncome: Joi.number().min(0).optional(),
      monthlyIncome: Joi.number().min(0).optional(),
      employmentStatus: Joi.string().valid('employed', 'self-employed', 'unemployed', 'retired', 'disabled', 'student').optional(),
      employer: Joi.string().max(100).optional().trim(),
      position: Joi.string().max(100).optional().trim(),
      yearsAtJob: Joi.number().min(0).optional(),
      previousEmployer: Joi.string().max(100).optional().trim(),
      debtToIncomeRatio: Joi.number().min(0).max(100).optional(),
      bankStatements: Joi.boolean().optional(),
      taxReturns: Joi.boolean().optional(),
      payStubs: Joi.boolean().optional()
    }).optional(),

    // Loan Status (Optional)
    loanStatus: Joi.object({
      applicationDate: Joi.date().optional(),
      status: Joi.string().valid('pending', 'approved', 'denied', 'in-review', 'documents-needed').optional(),
      loanAmount: Joi.number().min(0).optional(),
      loanPurpose: Joi.string().valid('debt-consolidation', 'home-improvement', 'major-purchase', 'emergency', 'other').optional(),
      requestedTerm: Joi.number().min(1).optional(),
      approvedAmount: Joi.number().min(0).optional(),
      approvedRate: Joi.number().min(0).max(100).optional(),
      approvedTerm: Joi.number().min(1).optional(),
      conditions: Joi.array().items(Joi.string()).optional(),
      denialReason: Joi.string().max(500).optional().trim()
    }).optional(),

    // Drivers (Optional)
    drivers: Joi.array().items(
      Joi.object({
        firstName: Joi.string().max(50).optional().trim(),
        lastName: Joi.string().max(50).optional().trim(),
        dateOfBirth: Joi.date().optional(),
        licenseNumber: Joi.string().max(30).optional().trim(),
        licenseState: Joi.string().length(2).optional().trim(),
        licenseExpiration: Joi.date().optional(),
        relationshipToApplicant: Joi.string().max(50).optional().trim(),
        violations: Joi.array().items(
          Joi.object({
            type: Joi.string().max(100).optional().trim(),
            date: Joi.date().optional(),
            description: Joi.string().max(500).optional().trim()
          })
        ).optional(),
        accidents: Joi.array().items(
          Joi.object({
            date: Joi.date().optional(),
            description: Joi.string().max(500).optional().trim(),
            atFault: Joi.boolean().optional()
          })
        ).optional()
      })
    ).optional(),

    // Vehicles (Optional)
    vehicles: Joi.array().items(
      Joi.object({
        year: Joi.number().min(1900).max(new Date().getFullYear() + 1).optional(),
        make: Joi.string().max(50).optional().trim(),
        model: Joi.string().max(50).optional().trim(),
        vin: Joi.string().length(17).optional().trim(),
        currentInsurance: Joi.object({
          company: Joi.string().max(100).optional().trim(),
          policyNumber: Joi.string().max(50).optional().trim(),
          expirationDate: Joi.date().optional(),
          liability: Joi.string().max(50).optional().trim(),
          comprehensive: Joi.string().max(50).optional().trim(),
          collision: Joi.string().max(50).optional().trim()
        }).optional(),
        lienHolder: Joi.string().max(100).optional().trim(),
        estimatedValue: Joi.number().min(0).optional()
      })
    ).optional(),

    // Homeowners (Optional)
    homeowners: Joi.object({
      ownsHome: Joi.boolean().optional(),
      propertyAddress: Joi.string().max(200).optional().trim(),
      propertyValue: Joi.number().min(0).optional(),
      purchaseDate: Joi.date().optional(),
      mortgageBalance: Joi.number().min(0).optional(),
      homeInsurance: Joi.object({
        company: Joi.string().max(100).optional().trim(),
        policyNumber: Joi.string().max(50).optional().trim(),
        annualPremium: Joi.number().min(0).optional(),
        coverageAmount: Joi.number().min(0).optional(),
        deductible: Joi.number().min(0).optional()
      }).optional(),
      propertyTax: Joi.number().min(0).optional(),
      hoaFees: Joi.number().min(0).optional()
    }).optional(),

    // Renters (Optional)
    renters: Joi.object({
      isRenter: Joi.boolean().optional(),
      rentalAddress: Joi.string().max(200).optional().trim(),
      monthlyRent: Joi.number().min(0).optional(),
      landlordInfo: Joi.object({
        name: Joi.string().max(100).optional().trim(),
        phone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
        email: Joi.string().email().optional().trim()
      }).optional(),
      leaseExpiration: Joi.date().optional(),
      rentersInsurance: Joi.object({
        hasInsurance: Joi.boolean().optional(),
        company: Joi.string().max(100).optional().trim(),
        policyNumber: Joi.string().max(50).optional().trim(),
        annualPremium: Joi.number().min(0).optional(),
        coverageAmount: Joi.number().min(0).optional()
      }).optional()
    }).optional(),

    // Income Protection (Optional)
    incomeProtection: Joi.object({
      lifeInsurance: Joi.array().items(
        Joi.object({
          company: Joi.string().max(100).optional().trim(),
          policyNumber: Joi.string().max(50).optional().trim(),
          coverageAmount: Joi.number().min(0).optional(),
          beneficiary: Joi.string().max(100).optional().trim(),
          premium: Joi.number().min(0).optional(),
          policyType: Joi.string().valid('term', 'whole', 'universal', 'variable').optional()
        })
      ).optional(),
      disabilityInsurance: Joi.object({
        hasInsurance: Joi.boolean().optional(),
        company: Joi.string().max(100).optional().trim(),
        monthlyBenefit: Joi.number().min(0).optional(),
        eliminationPeriod: Joi.number().min(0).optional(),
        benefitPeriod: Joi.string().max(50).optional().trim()
      }).optional(),
      healthInsurance: Joi.object({
        hasInsurance: Joi.boolean().optional(),
        company: Joi.string().max(100).optional().trim(),
        policyType: Joi.string().max(50).optional().trim(),
        monthlyCost: Joi.number().min(0).optional(),
        deductible: Joi.number().min(0).optional()
      }).optional()
    }).optional(),

    // Retirement (Optional)
    retirement: Joi.object({
      currentAge: Joi.number().min(18).max(120).optional(),
      retirementAge: Joi.number().min(50).max(100).optional(),
      retirementAccounts: Joi.array().items(
        Joi.object({
          accountType: Joi.string().valid('401k', '403b', 'ira', 'roth-ira', 'pension', 'other').optional(),
          institution: Joi.string().max(100).optional().trim(),
          currentBalance: Joi.number().min(0).optional(),
          monthlyContribution: Joi.number().min(0).optional(),
          employerMatch: Joi.number().min(0).optional()
        })
      ).optional(),
      socialSecurityBenefit: Joi.number().min(0).optional(),
      pensionBenefit: Joi.number().min(0).optional(),
      retirementGoals: Joi.string().max(1000).optional().trim(),
      riskTolerance: Joi.string().valid('conservative', 'moderate', 'aggressive').optional()
    }).optional(),

    // Lineage (Optional)
    lineage: Joi.object({
      referredBy: Joi.string().max(100).optional().trim(),
      referralSource: Joi.string().valid('consultant', 'client', 'advertisement', 'website', 'social-media', 'other').optional(),
      consultantAssigned: Joi.string().optional().trim(),
      teamLead: Joi.string().max(100).optional().trim(),
      regionalManager: Joi.string().max(100).optional().trim(),
      enrollmentDate: Joi.date().optional(),
      clientStatus: Joi.string().valid('prospect', 'enrolled', 'active', 'inactive', 'closed').optional()
    }).optional(),

    // System Fields (Optional - will be set by backend)
    status: Joi.string().valid("inactive", "active","pending").optional(),
    completionStatus: Joi.object({
      applicant: Joi.boolean().optional(),
      coApplicant: Joi.boolean().optional(),
      liabilities: Joi.boolean().optional(),
      mortgages: Joi.boolean().optional(),
      underwriting: Joi.boolean().optional(),
      loanStatus: Joi.boolean().optional(),
      drivers: Joi.boolean().optional(),
      vehicleCoverage: Joi.boolean().optional(),
      homeowners: Joi.boolean().optional(),
      renters: Joi.boolean().optional(),
      incomeProtection: Joi.boolean().optional(),
      retirement: Joi.boolean().optional(),
      lineage: Joi.boolean().optional()
    }).optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

// Validation for minimum required fields only (for partial saves)
export const validateMinimumClientFields = (req: Request, res: Response, next: NextFunction): Response | void => {
  const schema = Joi.object({
    basicInfo: Joi.object({
      firstName: Joi.string().min(2).max(50).required().trim(),
      lastName: Joi.string().min(2).max(50).required().trim()
    }).required(),
    
    contactInfo: Joi.object({
      email: Joi.string().email().max(100).required().trim().lowercase(),
      homePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      mobilePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      otherPhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim()
    }).required().custom((value, helpers) => {
      const { homePhone, mobilePhone, otherPhone } = value;
      if (!homePhone && !mobilePhone && !otherPhone) {
        return helpers.error('any.custom', { message: 'At least one phone number is required' });
      }
      return value;
    })
  }).unknown(true); // Allow other fields for partial updates

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Minimum validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

// Validation for client updates (all fields optional except ID)
export const validateClientUpdate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const schema = Joi.object({
    basicInfo: Joi.object({
      title: Joi.string().valid('Mr', 'Mrs', 'Ms', 'Dr', 'Prof').optional().trim(),
      firstName: Joi.string().min(2).max(50).optional().trim(),
      middleInitial: Joi.string().max(1).optional().trim(),
      lastName: Joi.string().min(2).max(50).optional().trim(),
      suffix: Joi.string().valid('Jr', 'Sr', 'II', 'III', 'IV').optional().trim(),
      maidenName: Joi.string().max(50).optional().trim(),
      isConsultant: Joi.boolean().optional()
    }).optional(),
    
    contactInfo: Joi.object({
      homePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      mobilePhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      otherPhone: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      fax: Joi.string().pattern(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/).optional().trim(),
      email: Joi.string().email().max(100).optional().trim().lowercase()
    }).optional()
    
    // Add other optional fields here as needed...
    
  }).unknown(true); // Allow any other fields for updates

  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Update validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};