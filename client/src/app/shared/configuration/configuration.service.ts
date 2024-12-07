import { collection, getDoc } from "firebase/firestore";
import { Configuration } from "./configuration.model";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { ErrorHandlingService } from "../error-handling/error-handling.service";


export class ConfigurationService {
    private readonly COLLECTION_NAME = 'configurations';
    constructor(
        private firestore: Firestore,
        private errorHandlingService: ErrorHandlingService

    ) {}
    
    getConfiguration(id: string): Promise<Configuration>{
        // Get the configuration from the database as general configuration type
        let configuration = getDoc(doc(collection(this.firestore, this.COLLECTION_NAME), id)).then((doc) => {
            if (doc.exists()) {
                return {...doc.data(), id: doc.id} as Configuration;
            } else {
                throw new Error('No such document!');
            }
        })
        return configuration;
    }
    
    async updateConfiguration(config: Configuration): Promise<Configuration>{
        // Update the configuration on the server
        return setDoc(doc(collection(this.firestore, this.COLLECTION_NAME), config.id), config).then(() => {return config});
    }
    
    createConfiguration(){
        // Create a new configuration on the server
        // Return the new configuration
    }
    
    deleteConfiguration(){
        // Delete the configuration on the server
        // Return the deleted configuration
    }
}