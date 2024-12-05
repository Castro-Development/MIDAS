import { Injectable, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';

@Injectable({

  providedIn: 'root',

})

export class CommonService {
  // datepipe =  inject(DatePipe);

  constructor(){

  }

  convertDate(date: Date | undefined){
    //let latest_date = this.datepipe.transform(date, 'MMMM dd, yyyy');
    if(date != undefined){
      let latest_date = formatDate(date,'MM/dd/yyyy', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }


  getDay(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'dd', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }
  getMonth(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'MMM', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }

  getYear(date: Date | undefined){
    if(date != undefined){
      let latest_date = formatDate(date,'yyyy', "en-US");
      return latest_date
    }
    else{
      return "No date to convert"
    }
  }

}
