exports.sendError = (res, errors, status = 401) => {
  res.status(status).json({
    success: false,
    errors
  });
}

exports.handleError = (err) => {
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect email' || err.message === 'incorrect password') {
    errors.others = 'Invalid password or email';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'User Already Exists';
    return errors;
  }

  // validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

exports.createRandomBytes = () => new Promise((resolve, reject) => {
  crypto.randomBytes(30, (err, buff) => {
    if (err) reject(err);

    const token = buff.toString('hex');
    resolve(token)
  })
})

exports.shuffle = (arr) => {
  return arr.sort(() => Math.random() - 0.5)
}