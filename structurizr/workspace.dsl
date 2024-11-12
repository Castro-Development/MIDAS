workspace "MidasC4" "A C4 model for the Midas Financial Accounting Software" {

    model {
        user = person "User not assigned a role yet; pending application"
        admin = person "Administrator"
        manager = person "Manager"
        accountant = person "Accountant"
        
        properties {
            "structurizr.groupSeparator" "/"
        }

        midas = softwareSystem "Midas Financial Accounting Software" {
            webApplication = container "Angular Webapp" {
                /* The web application will be split up into a few different areas of concern
                The first area of concern are components which anyone accessing the web application will have access to.
                There will be a navigation bar that will allow users to navigate the web application, only having access to certain components depending on their role.
                There will be a dashboard view which every user will see after loggin in. It will display important information based on what type of user is logged in.
                */
                
            /*  The second area of concern are components which all have access to.
                These will provide basic functionality that supports the rest of the application.
                */
                

                group userModule {
                //This group fulfills requirements, 1.1/5/7/8/9/10/11/12/
                    login = component "Login Webpage" {
                    tags Implemented
                        
                        Description "This component will allow users to log into the system. \
                                        It will check the user's credentials against the userDatabase and return a token \
                                        which will be used to authenticate the user. "
                                     /* Should fulfill R#1.1 by checking the user's credentials against the userDatabase\
                                        Should fulfill R#1.5 by allowing each type of user to login \
                                        Should fulfill R#1.7 by checking username, password(hidden), submit button, forgot password button, and create new user button\
                                        Should fulfill R#1.8 by routing to userApplicationForm if create new user button is clicked\
                                        Should fulfill R#1.9 by routing to forgotPassword if user is unauthorized\
                                        */
                    }
                    forgotPassword = component "Forgot Password Angular Component" {
                    tags Implemented
                        Description "This component will allow users to reset their password. \
                                        It will prompt the user to enter their email address, userId, and answer a security question."
                                     /* Should fulfill R#1.11 by not allowing password reset if the password has been used before\
                                        */

                    }
                    userProfile = component "User Profile Angular Component"{
                    tags Implemented
                        Description "This component will allow users to view and edit their profile. \
                                        It will allow users to change their password, email, and other information. \
                                        Should fulfill R#1. \
                                        "
                    }
                    calendar = component "Calendar Angular Component" {
                    tags "Not Implemented"
                        Description "This component will allow users to view a calendar of all their appointments. \
                                        It will allow users to view, edit, and delete appointments. \
                                        Should fulfill R#2.13 by displaying a popup calendar when clicked. \
                                        "
                    }
                    inbox = component "Inbox for all alerts and messages" {
                    tags "Not Implemented"
                        Description " This component will allow users to view all alerts and messages."
                                     /* Should fulfill R#1.19 by allowing users to receive emails from administrators \
                                        Should fulfill R#1.15 by notifying users of expiring passwords \
                                        Should fulfill R#1.8 by notifying admins of pending applications \
                                        Should fulfill R#3.3/35 by allowing autofill of email parameters \
                                        Should fulfill R#3.40 by facilitating email alert when journal entry submission is made. \
                                        */
                    }
                    dashboard = component "Dashboard View" {
                    tags "Not Implemented"
                        Description "This component will serve as a landing page for each user after logging in. \
                                        It will display a summary of all useful and important information. \
                                        "
                        
                    }
                    
                    group userComponents {
                        
                        applicationReview = component "Application Review" {
                            tags "Not Implemented"
                            Description "This component will allow users to view the status of their application. \
                                                It will show any issues that the administrators have with the application. \
                                                "
                        }
                        userApplicationForm = component "User Application" {
                            tags Implemented
                            
                            Description "This component will allow users to apply for an account. \
                                            It will prompt the user to fill out a form with their information. "
                                        /* Should fulfill R#1.20 by automatically generating the userId\
                                            Should fulfill R#1.8 by getting the user's information and sending it to the userServer\
                                            Should fulfill R#1.10 by displaying error message if password does not meet requirements\
                                            */
                            
                        }
                    }
                }
                
                group adminModule {
                    adminDashboard = component "Admin Controls Dashboard" {
                        tags "Not Implemented"
                        Description  "Displays options to review applications, view user profiles, and view Expired Password Report."
                                     /* Should fulfill R#1.19 by allowing administrators to email users \
                                        Should fulfill R#3.3 by autofilling fields from parameters. \
                                        Should fulfill R#1.2 by allowing administrators to create a new user without an application \
                                        Should fulfill R#1.16 by providing administrators with a list of all users \
                                        */
                    }
                    adminReviewApplication = component "Admin Application Review" {
                        tags "Not Implemented"
                        Description "This component will allow administrators to view a table of all users who have applied to use the system. \
                                        They will be able to view the user's application and either approve or deny the application."
                                     /* Should fulfill R#1.2 by allowing administrators to manage all user applications\
                                        Should fulfill R#1.8 by allowing administrators to approve or deny applications\
                                        */
                    }
                    
                    group userChart {
                        adminUserUpdate = component "Admin User Update" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to edit a user's profile."
                                            /* Should fulfill R#1.3 by allowing administrators to edit a user's profile\
                                                Should fulfill R#1.14 by allowing administrators to change a user's role\
                                                Should fulfill R#1.15 by allowing administrators to change a user's password\
                                                */
                        }
                        adminUserDeactivation = component "Admin User Deactivation" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to deactivate a user's account."
                                            /* Should fulfill R#1.4 by allowing admin to activate/deactivate a user's account\
                                                Should fulfill R#1.17 by allowing admin to suspend a user's account for a certain duration\
                                                */
                        }
                        adminUserProfileRead = component "Admin User Profile's Details" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to view a user's profile with in depth information. Should include all relevant information including event history."
                                            /* Should fulfill R#1.3 by allowing administrators to view a user's profile\
                                                */
                        }
                        adminUserCreate = component "Admin User Create Form" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to create a new user."
                                            /* Should fulfill R#1.2 by allowing administrators to create a new user without an application\
                                                */
                        }
                        adminUsersChart = component "Admin Users Chart" {
                            tags "Implemented"
                            Description "This component will allow administrators to view a chart of all user profiles with links to each entry. \
                                        They will be able to view any displayed user's profile by clicking on their name. A search and filter feature will be included."
                                    /* Should fulfill R#1.3 by allowing administrators to edit a user's profile\
                                        */
                        }
                    }
                    adminExpiredPasswordReport = component "Admin Expired Password Report" {
                        tags "Not Implemented"
                        Description "This component will allow administrators to view a report of all users who have expired passwords."
                                     /* Should fulfill R#1.18 by allowing admin to view a report of all expired passwords\
                                        */
                    }
                }
            /*  The fifth area of concern are functions which grant access to the financial information*/
                group portalModule {
                    /* First we must address all the administrator functions from Sprint 2 */
                    portalDashboard = component "Account Portal Dashboard" {
                        tags "Not Implemented"
                        Description "This component will allow display all important accessible information to the user with buttons to route to different features \
                                        "
                    }
                    group adminBusinessGLFunctions {
                        /* "Admin Functions to Manage Multiple Business General Ledgers" */
                        # Description "This feature allows administrators to manage multiple business general ledgers. \
                        #                 It will allow administrators to add, edit, and delete business general ledgers. \
                        #                 It will also allow administrators to assign users to business general ledgers."
                        adminBusinessGLCreate = component "Admin General Ledger Create" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to create a new business general ledger."
                                        /* Should fulfill R#2.1 by allowing administrators to create a new business general ledger. \
                                            Should fulfill R#2.1 by requiring all fields to be filled out. \
                                            Should fulfill R#2.2 by returning server error to duplicate business general ledger name/number \
                                            Should fulfill R#2.5 by not allowing decimal spaces or alphanumeric characters in business general ledger numbers. \
                                            */
                        }
                        adminBusinessGLDeactivate = component "Admin General Ledger Deactivate" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to deactivate a business general ledger."
                                        /* Should fulfill R#2.1 by allowing administrators to deactivate a business general ledger. \
                                            Should fulfill R#2.6 by refusing to deactivate a business general ledger with a remaining balance. \
                                            */
                        }
                        adminBusinessGLEdit = component "Admin General Ledger Edit" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to edit a business general ledger."
                                        /* Should fulfill R#2.1 by allowing administrators to edit a business general ledger. \
                                            Should fulfill R#2.1 by requiring all fields to be filled out. \
                                            Should fulfill R#2.2 by returning server error to duplicate business general ledger name/number \
                                            Should fulfill R#2.5 by not allowing decimal spaces or alphanumeric characters in business general ledger numbers. \
                                            */
                        }
                        adminBusinessGLAssignUsers = component "Admin General Ledger Assign Users" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to assign users to a business general ledger."
                                        /* Should fulfill R#2.1 by allowing administrators to assign users to a business general ledger. \
                                            */
                        }
                        adminBusinessGLChart = component "Admin Chart to View All Business' General Ledgers" {
                            tags "Not Implemented"
                            Description "This component will allow administrators to view all business general ledgers. \
                                        It will allow administrators to click on a business general ledger to view it. \
                                        It will also allow administrators to filter and search for business general ledgers."
                        }
                    }
                    group adminGeneralLedgerFunctions {
                        adminAccountEdit = component "Admin Account Edit" {
                            tags Implemented
                            Description "This component will allow administrators to edit an account."
                                            /*Should fulfill R#2.1 by allowing administrators to edit an account.*/
                        }
                        adminAccountAdd = component "Admin Account Add" {
                            tags Implemented
                            Description "This component will allow administrators to add an account."
                                        /* Should fulfill R#2.1 by allowing administrators to add an account. \
                                            Should fulfill R#2.1 by requiring all fields to be filled out. \
                                            Should fulfill R#2.2 by returning server error to duplicate account name/number \
                                            Should fulfill R#2.5 by not allowing decimal spaces or alphanumeric characters in account numbers. \
                                            */
                        }
                        adminAccountDeactivate = component "Admin Account Deactivate" {
                            tags Implemented
                            Description "This component will allow administrators to deactivate an account."
                                        /* Should fulfill R#2.1 by allowing administrators to deactivate an account. \
                                            Should fulfill R#2.6 by refusing to deactivate an account with a remaining balance. \
                                            */
                        }
                        adminAccountAssignUsers = component "Admin Account Assign Users" {
                            tags Implemented
                            Description "This component will allow administrators to assign users to an account."
                                        /* Should fulfill R#2.1 by allowing administrators to assign users to an account. \
                                            */
                        }
                        adminAccountChart = component "Admin Chart to View All Accounts" {
                            tags Implemented
                            Description "This component will allow administrators to view all accounts. \
                                        It will allow administrators to click on an account to view it. \
                                        It will also allow administrators to filter and search for accounts."
                        }
                    }
                    /* Then we must detail the component which displays accounts and charts of accounts */
                    chartOfAccounts = component "Chart of Accounts" {
                        tags Implemented
                        Description "This component will display all accounts and route to any accounts clicked. Must have a search and filter feature. Should allow emailing of users from userId. \n \
                                        Should fulfill R#2.7/8/11/12 && R#3.3/4/19"
                                     /* Should fulfill R#2.7 by displaying entire charts of accounts. \
                                        Should fulfill R#2.8 by allowing search by account number/name to locate account in chart of accounts. \
                                        Should fulfill R#2.11 && 3.13/15/30/41 by routing to accountLedger when clicking an account in chart of accounts. \
                                        Should fulfill R#3.13/15 by allowing managers to access the above feature. \
                                        Should fulfill R#2.12 by filtering the data in the chart of accounts page by various tokens. \
                                        Should fulfill R#3.3 by having email button for manager/accountant users on chart of accounts. \
                                                                Should autofill information to email function call parameters. \
                                        Should fulfill R#3.4 by allowing manager to create journal entries from accounts in chart of accounts. \
                                        Should fulfill R#3.19 by allowing accountants to only view the chart of accounts and navigate to accounts shown. \
                                        */
                    }
                    accountLedger = component "Account Ledger" {
                        tags Implemented
                        Description "This component will display all details of an account."
                                     /* Should fulfill R#2.7 by displaying individual accounts. \
                                        Should fulfill R#2.8 by displaying account returned from search. \
                                        Should fulfill R#3.6/31 by updating when new journal entries are approved and posted. \
                                        Should fulfill R#3.14/32/42 by having a post reference (PR) button to \
                                                            go to the journal entry which created the account. \
                                        Should fulfill R#3.43 by displaying the date of the journal entry, a description column which is usually empty, \
                                                            a debit column, a credit column, and a balance column. The balance after each transaction and \
                                                            posting must be accurate. \
                                        Should fulfill R#3.44 by having filtering and search features. Filter by date/date range and search by account name or amount. \
                                        */
                    }
                    accountEventLog = component "Account Event Log" {
                        tags "Not Implemented"
                        Description "This component will display event logs for each account selected."
                                     /* Should fulfill R#2.15 by displaying events for each account with the user id, \
                                                            time & date of the user who made the change. Should also have a unique \
                                                            auto-generated ID. \
                                        Should fulfill R#2.15 by displaying image of before and after change. \
                                                        NOTE: Try to generate image from stored data rather than storing before/after image. \
                                        Should fulfill R#3.2/12/29 by allowing admins, managers and accountants to access this information. \
                                        Should fulfill R#3.35 by allowing accountants to email manager/admin from the account page. \
                                                                Should autofill information to email function call parameters. \
                                        */
                    }
                    journalEntryForm = component "Journal Entry Component" {
                        tags "Not Implemented"
                        Description "This form should allow authorized users to fill in information for a journal entry. Debits come before credits and must equal each other. There may be multiple debits and/or credits."
                                     /* Should fulfill R#3.4 by automatically filling account information when routed to from chart of accounts. \
                                        Should fulfill R#3.5 by allowing accountants to create journal entry submission. \
                                        Should fulfill R#3.20 by having debits come before credits. \
                                        Should fulfill R#3.21 by allowing multiple debits and credits. \
                                        Should fulfill R#3.22 by allowing source documents to be attached. (pdf/word/excel/csv/jpg/png) \
                                        Should fulfill R#3.23 by allowing cancelling or resetting of unsubmitted journal entries. \
                                        Should fulfill R#3.24 by allowing accountants to prepare journal entries for review. \
                                        Should fulfill R#3.33 by requiring at least one debit and one credit. \
                                        Should fulfill R#3.34 by preventing journal entry submissions containing an error. \
                                        Should fulfill R#3.36 by checking that total credits equal total debits before allowing submission. \
                                        Should fulfill R#3.37 by housing all error messages in a database table. \
                                        Should fulfill R#3.38 by displaying errors in red. \
                                        Should fulfill R#3.39 by removing error when cause is corrected. \
                                        Should fulfill R#3.40 by triggering an email alert to manager when journal entry is submitted. \
                                        */
                    }
                    journalEntryReview = component "Journal Entry Review" {
                        tags "Not Implemented"
                        Description "This component will allow users to review journal entries. Will allow managers to accept or deny submissions. Will filter/sort by status and date."                                        
                                     /* Should fulfill R#3.5 by allowing managers to view and approve/deny journal entry submissions. \
                                                                Should include a reason field for denials. \
                                        Should fulfill R#3.7/8/9 by allowing filtering of journal entries by status (approved/denied/pending). \
                                        Should fulfill R#3.10 by allowing managers to filter categories by date. \
                                        Should fulfill R#3.11 by allowing search feature of account journal by account name, amount, or date. \
                                        Should fulfill R#3.23 by preventing accountants from deleting a submitted journal entry. \
                                        Should fulfill R#3.25 by allowing accountants to view journal entries from managers or other accountants. \
                                        Should fulfill R#3.26/27 by allowing accountants to view journal entries submitted with the status of (pending/approved/denied). \
                                        Should fulfill R#3.28 by allowing accountants to search journal by account name, amount, or date. \
                                        */
                    }
                }
                group shared {
                    helpFeature = component "Help Feature" {
                        tags "Not Implemented"
                        Description "This component will allow users to access help documentation. \
                                        It will display a list of common issues and solutions. "
                                    /* Should fulfill R#2.18 by providing a help feature for users. \
                                        Should fulfill R#2.17 by toggling help tooltip hover on/off. \
                                        Should fulfill R#2.17 by providing tooltip text for each button. \
                                        */
                    }
                    navbar = component "Navigation Bar" {
                        tags Implemented
                        Description "This component will allow users to navigate the web application.\
                                    It will contain links to different areas of the web application. \ "
                                 /* Should fulfill R#1.6 by displaying login username & profile picture on the top right \
                                    Should fulfill R#2.9 by showing name of logged in user. \
                                    Should fulfill R#2.10 by displaying the logo on every page. \
                                    Should fulfill R#2.14 by displaying buttons to other services such as journalizing. \
                                    */
                    }
                    userService = component "Midas User Service" {
                        
                        tags "Not Implemented"
                        Description "This service will hold the user model and link the authentication object for each user to the proper user data."
                    }
                    group firestoreService {
                        
                        userStoreAccess = component "Firestore User Profile Access Service" {
                            tags "Not Implemented"
                            Description "This service will provide access to the user profile data stored in the firestore database."
                        }

                        accountStoreAccess = component "Firestore Account Access Service" {
                            tags "Not Implemented"
                            Description "This service will provide access to the account data stored in the firestore database."
                        }
                    }
                    group dataModels {
                        userProfileModel = component "User Profile Model" {
                            tags "Not Implemented"
                            Description "This model will hold all the information about a user. \
                                        It will include the "
                        }
                        accountModel = component "Account Model" {
                            tags "Not Implemented"
                            Description "This model will hold all the information about an account. \
                                        It will include the account number, account name, account balance, and any other relevant information."
                        }
                        journalEntryModel = component "Journal Entry Model" {
                            tags "Not Implemented"
                            Description "This model will hold all the information about a journal entry. \
                                        It will include the account number, account name, account balance, and any other relevant information."
                        }
                        chartOfAccountsModel = component "Chart of Accounts Model" {
                            tags "Not Implemented"
                            Description "This model will hold all the information about the chart of accounts. \
                                        It will include the account number, account name, account balance, and any other relevant information."
                        }
                    }
                }

            }
            
            
            firebaseProject = container "Firebase Project" {
                tags "Server"
                group firestores {
                    userStore = component "Firestore Database for User Information" {
                        Description "This component will store user information. on all users who have applied to use the system. \n \
                                        Fulfills R#1.11/13/15"
                                     /* Should fulfill R#1.13 by locking account after 3 failed attempts \
                                        Should fulfill R#1.11 by refusing any passwords that have been used before \
                                        Should fulfill R#1.15 by sending notification to users with expiring passwords 3 days prior \
                                        */
                    }
                    accountStore = component "Account Server" {
                        
                        Description "This component will store all account information. \
                                        It will store information on all accounts and journal entries. \n \
                                        Fulfills R#2.1/2/5/6/7/8/15 and R#3.6"
                                    /*  Should fulfill R#2.1 by refusing invalid account formats. 
                                        Should fulfill R#2.2 by refusing duplicate account numbers/names. 
                                        Should fulfill R#2.5 by refusing account numbers with decimal/alphanumeric characters. 
                                        Should fulfill R#2.6 by refusing account deactivation if there is a remaining balance. 
                                        Should fulfill R#2.7 by returning individual accounts or entire charts of accounts. 
                                        Should fulfill R#2.8 by allowing search by account number/name to locate account in chart of accounts. 
                                        Should fulfill R#2.15 by storing events to be used in event logs. 
                                        Should fulfill R#3.6 by posting approved journal entries to the account database. */
                                        
                    }
                }
                authentication = component "Firebase Authentication System" {
                    Description "Firebase Authentication will provide secure authentication for the web application."
                }
            }
        
            group projectRequirements {
                    container sprintOne {
                        
                    }
                    container sprintTwo {

                    }
                    container sprintThree {

                    }
                    container sprintFour {

                    }
                    container sprintFive {

                    }
                }

        }
        
        
        
        
        
    }
    
    views {
        systemContext midas {
            include *
            
        }
        container midas {
            include *
        }

        component firebaseProject {
            include *
        }

        component webApplication {
            include user admin manager accountant
            include navbar dashboard helpFeature
            include *
            
        }

        component webApplication {
            include 
        }

        styles {
            element "Person" {
                shape person
                background green
            }
            element "Database" {
                shape cylinder
                background #f0f0f0
            }
            element "Server" {
                shape component
            }
            element "Implemented" {
                background yellow
            }
            element "Integrated" {
                background green
            }
            element "Not Implemented" {
                background red
            }
        }
    }

    

    

    configuration {
        scope softwaresystem
    }

}