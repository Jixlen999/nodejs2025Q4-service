import { User } from '../user/entities/user.entity';

type DB = {
  Users: User[];
};

export const db: DB = {
  Users: [],
};
