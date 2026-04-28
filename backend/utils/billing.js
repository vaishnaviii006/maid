// Generate invoice number: HH-YYYYMM-XXXX
const generateInvoiceNumber = () => {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HH-${ym}-${rand}`;
};

// Calculate billing for a month
const calculateBilling = ({ baseFee, presentDays, totalWorkingDays, overtimeMinutes = 0 }) => {
  const dailyRate = baseFee / totalWorkingDays;
  const absentDays = totalWorkingDays - presentDays;
  const absentDeduction = parseFloat((dailyRate * absentDays).toFixed(2));
  const overtimeAddition = parseFloat(((overtimeMinutes / 60) * (dailyRate / 8)).toFixed(2));
  const totalAmount = parseFloat((baseFee - absentDeduction + overtimeAddition).toFixed(2));

  return { absentDays, absentDeduction, overtimeAddition, totalAmount };
};

module.exports = { generateInvoiceNumber, calculateBilling };
