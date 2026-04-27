export const calculateCurrentStreak = (
  completions: string[], 
  today: string = new Date().toISOString().split('T')[0]
): number => {
  if (completions.length === 0) return 0;

  // 1. Sort unique dates in descending order (newest first)
  const sortedDates = [...new Set(completions)].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const mostRecent = sortedDates[0];
  const todayDate = new Date(today);
  const lastCompletionDate = new Date(mostRecent);

  // Calculate difference in days
  const diffInTime = todayDate.getTime() - lastCompletionDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

  // 2. If the most recent completion is older than yesterday, streak is broken
  if (diffInDays > 1) return 0;

  // 3. Count backward through consecutive days
  let streak = 0;
  let currentDateToCheck = lastCompletionDate;

  for (let i = 0; i < sortedDates.length; i++) {
    const compDate = new Date(sortedDates[i]);
    
    // Check if this date is the one we expect in the sequence
    if (i > 0) {
      const prevDate = new Date(sortedDates[i - 1]);
      const gap = (prevDate.getTime() - compDate.getTime()) / (1000 * 3600 * 24);
      
      // If there's a gap of more than 1 day between completions, streak ends
      if (gap > 1) break;
    }
    
    streak++;
  }

  return streak;
};