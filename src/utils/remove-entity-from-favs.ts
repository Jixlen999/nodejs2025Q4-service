import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

export const removeEntityFromFavs = (
  id: string,
  target: string[],
  entityTitle: string,
) => {
  const index = target.findIndex((item) => item === id);

  if (!index) {
    throw new NotFoundException(`${entityTitle} with id ${id} is not favorite`);
  }

  target.splice(index, 1);
};
