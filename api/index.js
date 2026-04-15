module.exports = (req, res) => {
  console.log('API function called', req.url);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'OK',
    message: 'Barangay Portal API is running',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};;