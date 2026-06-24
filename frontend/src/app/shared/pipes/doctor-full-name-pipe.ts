import { Pipe, PipeTransform } from '@angular/core';
import { Doctor } from '../../models/doctor';

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(value: Doctor | string, lastName?: string): string {
    if (typeof value === 'string') {
      return lastName ? `Dr. ${value} ${lastName}` : `Dr. ${value}`;
    }
    return `Dr. ${value.firstName} ${value.lastName}`;
  }
}
