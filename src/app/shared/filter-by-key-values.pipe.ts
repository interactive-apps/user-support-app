import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKeyValues'
})
export class FilterByKeyValuesPipe implements PipeTransform {

  transform(collection: any[], field: string, value: string): any[] {
    if (!collection) return [];
    if (!value || value.length == 0) return collection;
    return collection.filter(item => {
      
      return item.hasOwnProperty(field) && item[field].toLowerCase().indexOf(value.trim().toLowerCase()) !=-1;
    });
  }

}
