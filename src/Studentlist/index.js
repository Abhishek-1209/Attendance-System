import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore"; // 🔥 changed
import { db } from "../firebase/firebase-config";
import { attendanceTimeSlot } from "../utils/attendanceSlot";

const isWithinTimeSlot = (timeStr, startStr, endStr) => {
  const [h, m, s] = timeStr.split(":").map(Number);
  const current = h * 60 + m;

  const [sh, sm] = startStr.split(":").map(Number);
  const [eh, em] = endStr.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  return current >= start && current < end;
};

const Studentlist = () => {
  const [students, setStudents] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // 🔥 changed from getDocs to onSnapshot
    const unsubscribe = onSnapshot(collection(db, "Students"), (snapshot) => {
      const studentsArray = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          attendance: Array.isArray(data.attendance) ? data.attendance : [],
        };
      });

      const sortedStudents = studentsArray.sort(
        (a, b) => a.Roll_No - b.Roll_No
      );

      setStudents(sortedStudents);
    });

    return () => unsubscribe(); // 🔥 cleanup listener
  }, []);

  const columns = [
    { name: "S.no", align: "left", width: "30px" },
    { name: "Name", align: "left", minWidth: "100px" },
    { name: "Roll No", align: "left", minWidth: "100px" },
    { name: "Section", align: "left", minWidth: "100px" },
    ...attendanceTimeSlot.map((slot) => ({
      name: `${slot.start} - ${slot.end}`,
      align: "center",
      minWidth: "120px",
    })),
  ];

  const rowData = students.map((student, index) => {
    const attendanceToday = student.attendance.filter((a) => a.date === today);

    const timeSlotStatuses = attendanceTimeSlot.reduce((acc, slot) => {
      const presentInSlot = attendanceToday.some((record) =>
        isWithinTimeSlot(record.time, slot.start, slot.end)
      );
      acc[`${slot.start} - ${slot.end}`] = presentInSlot ? "✅" : "❌";
      return acc;
    }, {});

    return {
      "S.no": index + 1,
      Name: student.Name,
      "Roll No": student.Roll_No,
      Section: student.Section,
      ...timeSlotStatuses,
    };
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="student table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.name}
                align={column.align}
                style={{ width: column.width, minWidth: column.minWidth }}
              >
                {column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.name} align={column.align}>
                  {row[column.name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Studentlist;
