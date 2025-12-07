import { NotFoundException } from '@nestjs/common';

export const ThrowNotFound = (entity: string, id: string) => {
  throw new NotFoundException(`${entity} with id ${id} does not exist`);
};
