import { getApiCallState } from './apiHandler';
import { AllApiEndPoints } from './allEndPoints';

export function isPendingAnyApi(endpointPatterns) {
  if (!endpointPatterns) return false;
  
  const { pending } = getApiCallState();
  const patterns = Array.isArray(endpointPatterns) ? 
    endpointPatterns : 
    endpointPatterns.split('|');
  
  return patterns.some(pattern => {
    // Check if pattern exists in predefined endpoints
    const [group, key] = pattern.split(':');
    if (AllApiEndPoints[group]?.[key]) {
      return Object.values(pending).some(
        call => call.patternKey === pattern
      );
    }
    return false;
  });
}