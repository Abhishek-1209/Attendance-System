export const attendanceTimeSlot = [
  { start: "00:15", end: "00:20" },
  { start: "11:41", end: "12:40" },
  { start: "13:02", end: "13:03" },
  { start: "14:20", end: "14:21" },
  { start: "14:25", end: "15:23" },
  { start: "12:47", end: "12:48" },
  { start: "21:04", end: "22:15" },
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
