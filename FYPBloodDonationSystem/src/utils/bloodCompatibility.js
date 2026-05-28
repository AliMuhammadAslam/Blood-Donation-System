// Recipient blood type → blood types that can donate to them
const COMPATIBLE_DONORS = {
    'A+':  ['O-', 'O+', 'A-', 'A+'],
    'A-':  ['O-', 'A-'],
    'B+':  ['O-', 'O+', 'B-', 'B+'],
    'B-':  ['O-', 'B-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'O+':  ['O-', 'O+'],
    'O-':  ['O-'],
};

export const getCompatibleDonorTypes = (recipientBloodType) => {
    const key = recipientBloodType?.toUpperCase().trim();
    return COMPATIBLE_DONORS[key] || [];
};

export const scoreDonor = (donor, recipientBloodType) => {
    const compatible = getCompatibleDonorTypes(recipientBloodType);
    const donorType = donor.bloodValue?.toUpperCase().trim();

    if (!donorType || !compatible.includes(donorType)) return 0;

    let score = 60; // base score for any compatible type

    // Exact type match
    if (donorType === recipientBloodType?.toUpperCase().trim()) score += 30;

    // Universal donor (O-) can donate to anyone — extra weight
    if (donorType === 'O-') score += 15;

    // Currently available to donate
    if (donor.availableToDonate === true) score += 15;

    return score;
};

export const rankDonors = (donors, recipientBloodType) =>
    donors
        .map(donor => ({ ...donor, matchScore: scoreDonor(donor, recipientBloodType) }))
        .filter(donor => donor.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
