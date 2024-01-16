export function sortDates(dates: Date[]): Date[] {
  return dates.sort((a, b) => {
    return a.getTime() - b.getTime();
  });
}
export function isToday(date: Date) {
  const today = new Date();
  return date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear();
}
export function isHourAfterNow(hour: string) {
  const now = new Date();
  const hourCopy = hour;
  const [hourStr, minuteStr] = hourCopy.split(':');
  const hourNum = parseInt(hourStr, 10);
  const minuteNum = parseInt(minuteStr, 10);
  const appointmentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourNum, minuteNum);
  return appointmentDate > now;
}
export function isBetweenHours(hour: string, arg1: string, arg2: string) {
  const hourCopy = hour;
  const [hourStr, minuteStr] = hourCopy.split(':');
  const hourNum = parseInt(hourStr);
  const minuteNum = parseInt(minuteStr);
  const date1 = new Date(2021, 1, 1, parseInt(arg1.split(':')[0]), parseInt(arg1.split(':')[1]));
  const date2 = new Date(2021, 1, 1, parseInt(arg2.split(':')[0]), parseInt(arg2.split(':')[1]));
  const appointmentDate = new Date(2021, 1, 1, hourNum, minuteNum);
  return appointmentDate >= date1 && appointmentDate <= date2;

}
export function getTimeFromDate(date: Date) {
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  return `${hours}:${minutes}`;
}

export function addTwoHoursToTime(hourStr : string, minuteStr : string) {
  const currentHour = parseInt(hourStr, 10);
  const currentMinute = parseInt(minuteStr, 10);
  const currentTime = new Date();
  currentTime.setHours(currentHour, currentMinute);
  currentTime.setHours(currentTime.getHours() + 2);
  const updatedHour = currentTime.getHours().toString().padStart(2, '0');
  const updatedMinute = currentTime.getMinutes().toString().padStart(2, '0');
  return `${updatedHour}:${updatedMinute}`;
}
export function getWeekRange(selectedDate: Date): { firstDay: Date; lastDay: Date } {
  const currentDate = new Date(selectedDate);
  currentDate.setHours(0, 0, 0, 0);
  const dayOfWeek = currentDate.getUTCDay() ;
  const startDate = new Date(currentDate);
  const endDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - dayOfWeek);
  endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
  return {
    firstDay: startDate,
    lastDay: endDate,
  }; 
}
export function getDayNameFromDate(date: Date): string {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

export function formatDateToYYYYMMDD(date : Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function areDatesInSameWeek(date1: Date, date2: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const weekStartDay = 1;
  const monday1 = new Date(date1);
  monday1.setHours(0, 0, 0, 0);
  monday1.setDate(date1.getDate() - ((date1.getDay() - weekStartDay + 7) % 7));

  const monday2 = new Date(date2);
  monday2.setHours(0, 0, 0, 0);
  monday2.setDate(date2.getDate() - ((date2.getDay() - weekStartDay + 7) % 7));
  const daysDifference = Math.abs((monday1.getTime() - monday2.getTime()) / oneDay);
  return daysDifference <= 6;
}

export function formatDate(date : Date) {
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  const dayOfMonth = date.getDate();
  return `${dayName}`;
}