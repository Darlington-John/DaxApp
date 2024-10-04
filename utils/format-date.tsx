import { format, isToday, isYesterday, isThisWeek, differenceInDays } from 'date-fns';

export function transformDate(dateString: string): string {
  const date = new Date(dateString);

  
  if (isToday(date)) {
    return 'Today';
  }

  
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  
  if (isThisWeek(date)) {
    return format(date, 'EEEE'); 
  }

  
  return format(date, 'dd|MM|yy'); 
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  
  // Format the time to display in "h:mm a" (e.g., "5:55 AM")
  return format(date, 'h:mm a');
}

