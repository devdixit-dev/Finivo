import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense } from '@/contexts/ExpenseContext';
import { format } from 'date-fns';

export const exportToCSV = (expenses: Expense[], filename: string = 'expenses') => {
  const headers = ['Date', 'Name', 'Category', 'Type', 'Price (₹)'];
  const rows = expenses.map(expense => [
    format(new Date(expense.date), 'MMM dd, yyyy - hh:mm a'),
    expense.name,
    expense.category,
    expense.type,
    expense.price.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (expenses: Expense[], filename: string = 'expenses') => {
  const data = expenses.map(expense => ({
    'Date': format(new Date(expense.date), 'MMM dd, yyyy - hh:mm a'),
    'Name': expense.name,
    'Category': expense.category,
    'Type': expense.type,
    'Price (₹)': expense.price
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // Date
    { wch: 20 }, // Name
    { wch: 15 }, // Category
    { wch: 15 }, // Type
    { wch: 12 }  // Price
  ];

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (expenses: Expense[], filename: string = 'expenses') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Expense Report', 14, 20);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);
  
  // Prepare table data
  const tableData = expenses.map(expense => [
    format(new Date(expense.date), 'MMM dd, yyyy'),
    expense.name,
    expense.category,
    expense.type,
    `₹${expense.price.toLocaleString()}`
  ]);

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.price, 0);

  // Add table
  autoTable(doc, {
    head: [['Date', 'Name', 'Category', 'Type', 'Price']],
    body: tableData,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [20, 184, 166] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    foot: [['', '', '', 'Total:', `₹${total.toLocaleString()}`]],
  });

  doc.save(`${filename}.pdf`);
};
