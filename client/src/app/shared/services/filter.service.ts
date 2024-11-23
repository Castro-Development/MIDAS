import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FilteringService {



  filter<T extends Record<string, any>>(items: T[], filters: any, filterProperties: string[]): T[] {
    return items.filter((item: T) => {
      return filterProperties.every(property => {
        const filterValue = filters[property];
        if (filterValue === undefined || filterValue === null) {
          return true; // Ignore undefined/null filters
        }
        return item[property] === filterValue;
      });
    });
  }
}
