const { User } = require('../../../Models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
   it('should populate req.user with the payload of a valid JWT', () => {
      const user = {
         _id: mongoose.Types.ObjectId().toHexString(),
      };
      const token = new User(user).generateAuthToken();

      const req = {
         header: jest.fn().mockReturnValue(token),
      };

      const res = jest.fn();

      const next = jest.fn();

      auth(req, res, next);

      expect(req.user).toMatchObject(user);
   });
});
