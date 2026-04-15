module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'OK',
    message: 'Barangay Portal API is running',
    timestamp: new Date().toISOString()
  });
};