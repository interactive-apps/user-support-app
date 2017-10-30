import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitByLength'
})
export class LimitByLengthPipe implements PipeTransform {

  transform(array: any[], length: number): any[] {
    if (!array) return [];
    if(array.length > length) {
      return array.slice(0, length);
    }
    return array;
  }

}
