import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class FilteringService {

  const timestampToDate = (timestamp) => {
  // Handle if the timestamp is already a Date
  if (timestamp instanceof Date) return timestamp;
  
  // Handle if the timestamp is a Firebase Timestamp
  if (timestamp?.toDate) return timestamp.toDate();
  
  // Handle if the timestamp is a number (seconds or milliseconds)
  if (typeof timestamp === 'number') {
    // Check if it's seconds (Firebase) or milliseconds (JavaScript)
    return new Date(timestamp < 1000000000000 ? timestamp * 1000 : timestamp);
  }
  
  // Return null for invalid input
  return null;
};

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
