import { AdjustingEntryType } from "../../portalModule/adjustingEntries/adjusting-entry.model";

export interface Configuration {
    id: string;

}

export interface AdjustingEntryConfiguration extends Configuration{
    defaultAdjustingEntryTypes: AdjustingEntryType[];
    requiresApproval: boolean;
    
}