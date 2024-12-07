import { Injectable, inject } from "@angular/core";
import { FiscalPeriod } from "../fiscalPeriod/fiscal-period.model";
import { ConfigurationService } from "../../shared/configuration/configuration.service";
import { AdjustingEntryFirestoreService } from "./adjusting-entry.service";
import { RecurringAdjustingEntry } from "./adjusting-entry.model";
import { Observable, tap } from "rxjs";


@Injectable({ providedIn: 'root' })
export class AdjustingEntriesFacade {
    configurtaionService = inject(ConfigurationService);
    adjustService = inject(AdjustingEntryFirestoreService);

    constructor() {}
    /*
     * Recurring Adjusting Entries
     */
    createRecurringAdjustingEntry(adjustingEntry: RecurringAdjustingEntry):Promise<void> {
        return this.adjustService.createRecurringAdjustingEntry(adjustingEntry);
        // Create a new recurring adjusting entry
    }
    getRecurringAdjustingEntry(recurringEntryId: string): Observable<RecurringAdjustingEntry>{
        // Get a recurring adjusting entry by ID
        return this.adjustService.getRecurringAdjustingEntry(recurringEntryId).pipe(
            tap((entry) => {
                if(!entry){
                    throw new Error('No such document!');
                }else{
                    console.log(entry);
                }
            })
        );
        // Return the recurring adjusting entry document
        
    }
    getRecurringAdjustingEntries(): Observable<RecurringAdjustingEntry[]>{
        // Get all recurring adjusting entries
        return this.adjustService.getRecurringAdjustingEntries().pipe(
            tap((entries) => { console.log(entries); })
        );
        

    }
    updateRecurringAdjustingEntry(updatedValues: Partial<RecurringAdjustingEntry>):Promise<void>{
        return this.adjustService.updateRecurringAdjustingEntry(updatedValues).then(() => {
            console.log('Updated');
        
        });
        
    }
    archiveRecurringAdjustingEntry(adjustingEntryId: string): Promise<void>{
        return this.adjustService.archiveRecurringAdjustingEntry(adjustingEntryId)
        .then(() => {
            console.log('Archived')
        });
    }

    /*
     * Period End Adjusting Entries
     */
    createPeriodEndAdjustingEntry(){

    }
    getPeriodEndAdjustingEntry(fiscalPeriod: FiscalPeriod){

    }
    getPeriodEndChecklist(fiscalPeriod: FiscalPeriod){

    }
    updatePeriodEndAdjustingEntry(){

    }
    deletePeriodEndAdjustingEntry(){

    }
        

    
}