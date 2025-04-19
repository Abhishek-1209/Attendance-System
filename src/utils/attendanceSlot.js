export const attendanceTimeSlot = [
    { start: "09:15", end: "10:15" },
    { start: "10:15", end: "11:15" },
    { start: "11:15", end: "12:15" },
    { start: "13:16", end: "14:15" },
    { start: "14:15", end: "15:15" },
  ];
// utils/checkTimeSlot.js
export const isWithinTimeSlot = (start, end) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
  
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
  
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
  
    return currentTime >= startTime && currentTime <= endTime;
  };
  