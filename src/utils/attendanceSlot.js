export const attendanceTimeSlot = [
  { start: "09:15", end: "10:15" },
  { start: "10:15", end: "11:15" },
  { start: "11:15", end: "12:15" },
  { start: "13:16", end: "14:15" },
  { start: "14:15", end: "15:15" },
];

export const getCurrentTimeSlot = () => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let slot of attendanceTimeSlot) {
    const [sh, sm] = slot.start.split(":").map(Number);
    const [eh, em] = slot.end.split(":").map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return `${slot.start} - ${slot.end}`;
    }
  }

  return null;
};
