import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsHeightSequentialValidator } from './is-height-sequential.validator';

export function IsHeightSequential(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHeightSequentialValidator,
    });
  };
}
