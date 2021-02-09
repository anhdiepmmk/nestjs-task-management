import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  describe('Validate password', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.password = 'testPassword';
      user.salt = 'testSalt';
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should returns true as password is valid', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('testPassword'));
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });

    it('should returns false as password is invalid', async () => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('wrongPassword'));
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
