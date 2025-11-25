module.exports.parseDate = function (dateStr) {
  if (!dateStr) return null;

  // Expected input: DD/MM/YYYY
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;

  // Convert to YYYY-MM-DD for JS Date
  const formatted = `${yyyy}-${mm}-${dd}`;

  const date = new Date(formatted);
  return isNaN(date) ? null : date;
};
