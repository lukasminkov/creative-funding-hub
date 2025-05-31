
import { CampaignTestScenario } from '@/types/campaign.types';

export const campaignTestScenarios: CampaignTestScenario[] = [
  // Valid scenarios
  {
    id: 'valid-retainer',
    name: 'Valid Retainer Campaign',
    description: 'A properly configured retainer campaign',
    expectedValidation: 'valid',
    campaignData: {
      title: 'Fashion Brand Retainer',
      description: 'Long-term partnership with fashion influencers for brand awareness',
      type: 'retainer',
      contentType: 'UGC',
      category: 'Fashion',
      platforms: ['TikTok'],
      totalBudget: 5000,
      currency: 'USD',
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      countryAvailability: 'usa',
      visibility: 'public'
    }
  },
  {
    id: 'valid-payPerView',
    name: 'Valid Pay Per View Campaign',
    description: 'A properly configured pay-per-view campaign',
    expectedValidation: 'valid',
    campaignData: {
      title: 'Viral Video Challenge',
      description: 'Create engaging content and get paid per thousand views',
      type: 'payPerView',
      contentType: 'UGC',
      category: 'Entertainment',
      platforms: ['TikTok', 'Instagram Reels'],
      totalBudget: 10000,
      currency: 'USD',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ratePerThousand: 5,
      maxPayoutPerSubmission: 500,
      viewValidationPeriod: 10,
      countryAvailability: 'worldwide',
      visibility: 'public'
    }
  },
  {
    id: 'valid-challenge',
    name: 'Valid Challenge Campaign',
    description: 'A properly configured challenge campaign with equal prize distribution',
    expectedValidation: 'valid',
    campaignData: {
      title: 'Best Recipe Challenge',
      description: 'Submit your best recipe video for a chance to win prizes',
      type: 'challenge',
      contentType: 'UGC',
      category: 'Food',
      platforms: ['YouTube Shorts', 'Instagram Reels'],
      totalBudget: 3000,
      currency: 'USD',
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      prizeDistributionType: 'equal',
      prizeAmount: 500,
      winnersCount: 5,
      countryAvailability: 'usa',
      visibility: 'public'
    }
  },

  // Invalid scenarios
  {
    id: 'invalid-missing-title',
    name: 'Missing Title',
    description: 'Campaign without a title should fail validation',
    expectedValidation: 'invalid',
    expectedErrors: ['Campaign title is required'],
    campaignData: {
      title: '',
      description: 'This campaign is missing a title',
      type: 'retainer',
      contentType: 'UGC',
      category: 'Fashion',
      platforms: ['TikTok'],
      totalBudget: 1000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      countryAvailability: 'usa'
    }
  },
  {
    id: 'invalid-past-date',
    name: 'Past End Date',
    description: 'Campaign with end date in the past should fail',
    expectedValidation: 'invalid',
    expectedErrors: ['End date must be in the future'],
    campaignData: {
      title: 'Invalid Date Campaign',
      description: 'This campaign has an invalid end date',
      type: 'retainer',
      contentType: 'UGC',
      category: 'Fashion',
      platforms: ['TikTok'],
      totalBudget: 1000,
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      applicationDeadline: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      countryAvailability: 'usa'
    }
  },
  {
    id: 'invalid-budget-zero',
    name: 'Zero Budget',
    description: 'Campaign with zero budget should fail',
    expectedValidation: 'invalid',
    expectedErrors: ['Budget must be at least $1'],
    campaignData: {
      title: 'Zero Budget Campaign',
      description: 'This campaign has zero budget',
      type: 'payPerView',
      contentType: 'UGC',
      category: 'Tech',
      platforms: ['YouTube Shorts'],
      totalBudget: 0,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ratePerThousand: 2,
      maxPayoutPerSubmission: 100,
      countryAvailability: 'worldwide'
    }
  },
  {
    id: 'invalid-retainer-multiple-platforms',
    name: 'Retainer Multiple Platforms',
    description: 'Retainer campaign with multiple platforms should fail',
    expectedValidation: 'invalid',
    expectedErrors: ['Retainer campaigns require exactly one platform'],
    campaignData: {
      title: 'Multi-Platform Retainer',
      description: 'Retainer campaign across multiple platforms',
      type: 'retainer',
      contentType: 'UGC',
      category: 'Lifestyle',
      platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
      totalBudget: 2000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      countryAvailability: 'usa'
    }
  },
  {
    id: 'invalid-challenge-prize-exceeds-budget',
    name: 'Challenge Prize Exceeds Budget',
    description: 'Challenge where total prizes exceed budget',
    expectedValidation: 'invalid',
    expectedErrors: ['Total prize amount cannot exceed campaign budget'],
    campaignData: {
      title: 'Over-Budget Challenge',
      description: 'Challenge with prizes exceeding budget',
      type: 'challenge',
      contentType: 'UGC',
      category: 'Art',
      platforms: ['Instagram Reels'],
      totalBudget: 1000,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      prizeDistributionType: 'equal',
      prizeAmount: 500,
      winnersCount: 3, // 500 * 3 = 1500 > 1000 budget
      countryAvailability: 'worldwide'
    }
  }
];

// Helper function to run a test scenario
export const runTestScenario = async (
  scenarioId: string, 
  validateFunction: (data: any) => Promise<{ success: boolean; errors?: any }>
): Promise<{ passed: boolean; details: string }> => {
  const scenario = campaignTestScenarios.find(s => s.id === scenarioId);
  
  if (!scenario) {
    return { passed: false, details: `Scenario ${scenarioId} not found` };
  }

  try {
    const result = await validateFunction(scenario.campaignData);
    
    if (scenario.expectedValidation === 'valid') {
      if (result.success) {
        return { passed: true, details: 'Validation passed as expected' };
      } else {
        return { 
          passed: false, 
          details: `Expected valid but got errors: ${JSON.stringify(result.errors)}` 
        };
      }
    } else {
      if (!result.success) {
        return { passed: true, details: 'Validation failed as expected' };
      } else {
        return { 
          passed: false, 
          details: 'Expected validation to fail but it passed' 
        };
      }
    }
  } catch (error) {
    return { 
      passed: false, 
      details: `Test scenario threw error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Helper to run all test scenarios
export const runAllTestScenarios = async (
  validateFunction: (data: any) => Promise<{ success: boolean; errors?: any }>
): Promise<{ passed: number; failed: number; results: Array<{ scenarioId: string; passed: boolean; details: string }> }> => {
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const scenario of campaignTestScenarios) {
    const result = await runTestScenario(scenario.id, validateFunction);
    results.push({
      scenarioId: scenario.id,
      passed: result.passed,
      details: result.details
    });

    if (result.passed) {
      passed++;
    } else {
      failed++;
    }
  }

  return { passed, failed, results };
};
