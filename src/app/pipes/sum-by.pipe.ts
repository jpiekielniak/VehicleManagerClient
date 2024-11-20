import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumBy',
  standalone: true
})
export class SumByPipe implements PipeTransform {
  transform(array: any[], key: string): number {
    return array ? array.reduce((sum, item) => sum + (item[key] || 0), 0) : 0;
  }
}
