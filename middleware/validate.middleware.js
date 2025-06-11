const validateRegister = (req, res, next) => {
  const { email, password, username } = req.body;

  // Check if all fields are present
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'All fields (email, password, username) are required' });
  }

  // Check for valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Check password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  // Check username length (optional, example)
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  next();
};

export { validateRegister };
