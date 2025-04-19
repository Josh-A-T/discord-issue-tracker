/* 
 Controller functions for authorization endpoint
*/


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  try {
    const { username, discriminator, discordId, email, password } = req.body;
    
    const user = await User.create({
      username,
      discriminator,
      discordId,
      email,
      password
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      //console.log('User not found');
      return res.status(400).send({ error: 'Unable to login' });
    }

    //console.log('Found user:', user.username);
    // console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    //console.log('Password match:', isMatch);
    
    if (!isMatch) {
      //console.log('Password does not match');
      return res.status(400).send({ error: 'Unable to login' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log('Login successful for:', user.email);
    res.send({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token 
    });
  } catch (error) {
    //console.error('Login error:', error);
    res.status(400).send({ error: 'Login failed' });
  }
};

const discordLoginOrRegister = async (req, res) => { /* TODO */};

const getMe = async (req, res) => {
  res.send(req.user);
};

module.exports = {
  register,
  login,
  //discordLoginOrRegister,
  getMe
};