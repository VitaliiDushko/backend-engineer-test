import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsBlockIdValidValidator } from './is-block-id-valid.validator';

export function IsBlockIdValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlockIdValidValidator,
    });
  };
}
