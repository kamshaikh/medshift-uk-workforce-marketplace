import { Shift, HealthcareProfessional, MatchResult, MatchReason } from '../types';

/**
 * Calculates compatibility score between a shift and a healthcare professional.
 * Criteria:
 * - Specialty: 30 points
 * - Location: 20 points
 * - Availability: 30 points
 * - Experience: 15 points
 * - Profession: 5 points
 * Total = 100 points
 */
export function calculateMatchScore(
  shift: Shift,
  professional: HealthcareProfessional
): MatchResult {
  const detailedReasons: MatchReason[] = [];
  const textReasons: string[] = [];
  let score = 0;

  // 1. Specialty (Max 30)
  if (professional.specialty === shift.specialty) {
    score += 30;
    textReasons.push(`✓ ${shift.specialty} specialist`);
    detailedReasons.push({
      label: `Exact specialty match (${shift.specialty})`,
      isPositive: true,
      pointsAwarded: 30,
      maxPoints: 30,
    });
  } else if (
    (shift.specialty === 'Emergency Medicine' && professional.specialty === 'General Medicine') ||
    (shift.specialty === 'General Medicine' && professional.specialty === 'Emergency Medicine') ||
    (shift.specialty === 'Cardiology' && professional.specialty === 'General Medicine') ||
    (shift.specialty === 'Neurology' && professional.specialty === 'General Medicine')
  ) {
    score += 15;
    textReasons.push(`~ Related clinical background (${professional.specialty})`);
    detailedReasons.push({
      label: `Cross-disciplinary transferable skills (${professional.specialty})`,
      isPositive: true,
      pointsAwarded: 15,
      maxPoints: 30,
    });
  } else {
    textReasons.push(`✗ Specialty mismatch (${professional.specialty} vs required ${shift.specialty})`);
    detailedReasons.push({
      label: `Specialty mismatch (${professional.specialty})`,
      isPositive: false,
      pointsAwarded: 0,
      maxPoints: 30,
    });
  }

  // 2. Location (Max 20)
  if (professional.city === shift.city) {
    score += 20;
    textReasons.push(`✓ Located in ${shift.city}`);
    detailedReasons.push({
      label: `Within immediate regional trust boundary (${shift.city})`,
      isPositive: true,
      pointsAwarded: 20,
      maxPoints: 20,
    });
  } else {
    // Inter-city proximity approximations in UK
    const nearbyPairs: Record<string, string[]> = {
      Manchester: ['Liverpool', 'Leeds'],
      Liverpool: ['Manchester'],
      Leeds: ['Manchester'],
      London: ['Bristol'],
      Bristol: ['London'],
      Edinburgh: ['Newcastle'],
      Birmingham: ['Manchester', 'Bristol'],
    };

    if (nearbyPairs[shift.city]?.includes(professional.city)) {
      score += 10;
      textReasons.push(`~ Nearby region (${professional.city} to ${shift.city})`);
      detailedReasons.push({
        label: `Commutable transit corridor (${professional.city})`,
        isPositive: true,
        pointsAwarded: 10,
        maxPoints: 20,
      });
    } else {
      textReasons.push(`✗ Located in ${professional.city} (outside ${shift.city} commute radius)`);
      detailedReasons.push({
        label: `Distal location (${professional.city})`,
        isPositive: false,
        pointsAwarded: 0,
        maxPoints: 20,
      });
    }
  }

  // 3. Availability (Max 30)
  // Check day match if possible
  const dayAbbrMap: Record<string, 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'> = {
    today: 'Wed', // Wednesday benchmark
    tomorrow: 'Thu',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const shiftDateLower = (shift.dateLabel || '').toLowerCase();
  let targetDay: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' = 'Wed';
  if (shiftDateLower.includes('today')) targetDay = 'Wed';
  else if (shiftDateLower.includes('tomorrow')) targetDay = 'Thu';
  else {
    for (const [k, v] of Object.entries(dayAbbrMap)) {
      if (shiftDateLower.includes(k)) {
        targetDay = v;
        break;
      }
    }
  }

  const hasDayAvailable = professional.availabilityDays.includes(targetDay);
  const isAvailableNow = professional.currentStatus === 'Available';

  if (hasDayAvailable && isAvailableNow) {
    score += 30;
    textReasons.push(`✓ Available during requested shift (${shift.startTime} - ${shift.endTime})`);
    detailedReasons.push({
      label: `Active rota availability on ${targetDay}`,
      isPositive: true,
      pointsAwarded: 30,
      maxPoints: 30,
    });
  } else if (hasDayAvailable) {
    score += 20;
    textReasons.push(`~ Available on ${targetDay} (currently marked resting)`);
    detailedReasons.push({
      label: `On-call available on ${targetDay}`,
      isPositive: true,
      pointsAwarded: 20,
      maxPoints: 30,
    });
  } else if (isAvailableNow) {
    score += 15;
    textReasons.push(`~ Flexible on-call status`);
    detailedReasons.push({
      label: `Flexible locum on-call capability`,
      isPositive: true,
      pointsAwarded: 15,
      maxPoints: 30,
    });
  } else {
    textReasons.push(`✗ Not available on scheduled shift day (${targetDay})`);
    detailedReasons.push({
      label: `Rota conflict on ${targetDay}`,
      isPositive: false,
      pointsAwarded: 0,
      maxPoints: 30,
    });
  }

  // 4. Experience (Max 15)
  const reqExp = shift.requiredExperienceYears || 3;
  if (professional.experienceYears >= reqExp) {
    score += 15;
    textReasons.push(`✓ ${professional.experienceYears} years experience (exceeds ${reqExp}+ requirement)`);
    detailedReasons.push({
      label: `Exceeds minimum clinical experience requirement (${professional.experienceYears}y)`,
      isPositive: true,
      pointsAwarded: 15,
      maxPoints: 15,
    });
  } else if (professional.experienceYears >= reqExp - 1) {
    score += 8;
    textReasons.push(`~ ${professional.experienceYears} years experience (approaching ${reqExp}+ requirement)`);
    detailedReasons.push({
      label: `Near required clinical experience (${professional.experienceYears}y)`,
      isPositive: true,
      pointsAwarded: 8,
      maxPoints: 15,
    });
  } else {
    textReasons.push(`✗ Experience below threshold (${professional.experienceYears}y vs ${reqExp}y required)`);
    detailedReasons.push({
      label: `Insufficient clinical experience (${professional.experienceYears}y)`,
      isPositive: false,
      pointsAwarded: 0,
      maxPoints: 15,
    });
  }

  // 5. Profession (Max 5)
  if (professional.profession === shift.profession) {
    score += 5;
    textReasons.push(`✓ Profession matches (${shift.profession})`);
    detailedReasons.push({
      label: `Direct profession match (${shift.profession})`,
      isPositive: true,
      pointsAwarded: 5,
      maxPoints: 5,
    });
  } else {
    textReasons.push(`✗ Profession mismatch (${professional.profession} vs ${shift.profession})`);
    detailedReasons.push({
      label: `Profession mismatch (${professional.profession})`,
      isPositive: false,
      pointsAwarded: 0,
      maxPoints: 5,
    });
  }

  // Ensure bounds
  score = Math.min(100, Math.max(0, score));

  // Determine match level
  let matchLevel: 'excellent' | 'strong' | 'possible' | 'weak';
  if (score >= 90) matchLevel = 'excellent';
  else if (score >= 75) matchLevel = 'strong';
  else if (score >= 60) matchLevel = 'possible';
  else matchLevel = 'weak';

  return {
    professional,
    score,
    reasons: textReasons,
    detailedReasons,
    matchLevel,
  };
}

/**
 * Ranks all available healthcare professionals for a given shift.
 * Sorts from highest score to lowest score.
 */
export function rankProfessionalsForShift(
  shift: Shift,
  professionals: HealthcareProfessional[]
): MatchResult[] {
  const matches = professionals.map((prof) => calculateMatchScore(shift, prof));
  return matches.sort((a, b) => b.score - a.score);
}
