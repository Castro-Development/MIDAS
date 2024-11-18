import { Injectable } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { AnnualFiscalPeriod, FiscalPeriod } from "./fiscal-period.model";


@Injectable({
    providedIn: 'root'
})
export class FiscalPeriodFirestore{
    constructor(
        private firestore: Firestore
    ) {

    }

    getAnnualFiscalPeriods(): FiscalPeriod[]{
        throw new Error('Method not implemented.');
    }

    setAnnualFiscalPeriod(period: AnnualFiscalPeriod): void{
        throw new Error('Method not implemented.');
    }

    getQuarterlyFiscalPeriods(): FiscalPeriod[]{
        throw new Error('Method not implemented.');
    }
    
}