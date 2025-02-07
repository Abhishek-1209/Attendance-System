import React from "react";
import studentdata from "../Json/Studentdata";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import css from "./Studentlist.css";

const Studentlist = () => {
  const columns = [
    { name: "S.no", align: "left", width: "30px" },
    { name: "Name", align: "left", minWidth: "100px" },
    { name: "Roll No", align: "left", minWidth: "100px" },
    { name: "Section", align: "left", minWidth: "100px" },
    { name: "Status", align: "left", minWidth: "110px" },
  ];

  const rowData = studentdata.map((item, index) => ({
    "S.no": index + 1,
    Name: item.name,
    "Roll No": item.roll,
    Section: item.section,
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
