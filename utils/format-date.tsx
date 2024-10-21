import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

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
  
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date passed:', dateString);
    return 'Invalid Date'; 
  }

  
  return format(date, 'h:mm a');
}

export const isMoreThanOneDay = (date: string | Date) => {
  const oneDayInMs = 24 * 60 * 60 * 1000; 
  const now = new Date();
  const updatedDate = new Date(date);

  return now.getTime() - updatedDate.getTime() > oneDayInMs;
};


