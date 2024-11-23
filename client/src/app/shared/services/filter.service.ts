import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FilteringService {

  compareTimestampDates(itemTimestamp: Timestamp, filterValue: Date | Timestamp | string): boolean {
    const itemDate = itemTimestamp.toDate();
    const filterDate = filterValue instanceof Date 
      ? filterValue 
      : filterValue instanceof Timestamp 
        ? filterValue.toDate()
        : new Date(filterValue);

    return this.isSameDay(itemDate, filterDate);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

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
