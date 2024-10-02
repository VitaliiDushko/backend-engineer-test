import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsInputOutputSumsEqualValidator } from './is-input-output-sums-equal.validator';

export function IsEqualInputOutputSums(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsInputOutputSumsEqualValidator,
    });
  };
}
