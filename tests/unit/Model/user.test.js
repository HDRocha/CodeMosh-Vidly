const { User } = require('../../../Models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
   it('should generate a json web token with a payload (_id)', () => {
      const payload = { _id: new mongoose.Types.ObjectId().toHexString() };
      const user = new User(payload);
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, config.get('jwtPrivatekey'));
      expect(decoded).toMatchObject(payload);
   });
});
