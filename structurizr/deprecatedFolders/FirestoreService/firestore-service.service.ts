// import { Injectable } from '@angular/core';
// import { UserProfile } from '@angular/fire/auth';
// import { getFirestore, collection, collectionData, addDoc, query, where, getDoc, setDoc, doc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs/internal/Observable';
// import { UserModel } from '../../client/src/app/models/user.model';
// import { getDocs } from 'firebase/firestore';


// @Injectable({
//   providedIn: 'root'
// })
// export class FirestoreService {
  
//   private db = getFirestore();
//   users$: Observable<UserProfile[]>;
//   constructor() { 
//     const userProfileCollection = collection(this.db, 'users');

//     this.users$ = collectionData(userProfileCollection) as Observable<UserProfile[]>;
//   }
  
//   getUsers() {
//     return this.users$;
//   }

//   createUserProfile(user: UserModel) {
//     try {
//       setDoc(doc(this.db, "users", user.id), user);

//       // const docRef = addDoc(collection(this.db, "userProfiles"), {
//       //   firstName: user.firstname,
//       //   lastName: user.lastname,
//       //   phone: user.phone,
//       //   street: user.street,
//       //   zip: user.zip,
//       //   state: user.state,
//       //   role: user.role,
//       //   id: user.id,
//       // });
        
//     }catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   }

  

//   findUserById(id: string): any {
//     const userQuery = query(collection(this.db, "users", ), where("id", '==', id));
//     const queryResult = getDocs(userQuery);
//     queryResult.then((userInfo) => {
//       console.log(userInfo);
//     });
    
//     return soughtUser;
//   }
// }

