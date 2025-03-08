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
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

const Studentlist = () => {
  const [students, setStudents] = useState([]);
  console.log(students);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Students"));

        const studentsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedStudents = studentsArray.sort(
          (a, b) => a.Roll_No - b.Roll_No
        );

        setStudents(sortedStudents);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { name: "S.no", align: "left", width: "30px" },
    { name: "Name", align: "left", minWidth: "100px" },
    { name: "Roll No", align: "left", minWidth: "100px" },
    { name: "Section", align: "left", minWidth: "100px" },
    { name: "Status", align: "left", minWidth: "110px" },
  ];

  const rowData = students.map((item, index) => ({
    "S.no": index + 1,
    Name: item.Name,
    "Roll No": item.Roll_No,
    Section: item.Section,
    Status: "P | A",
  }));

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
