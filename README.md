" Event Management API" 

 Description

This backend system allows:

- Admin or users to create events.
- Users to register or unregister for events.
- Events to be capacity-controlled.
- Fetching upcoming events.
- Viewing user-specific registrations.
- Tracking event stats like total registrations and remaining seats

- Node.js with Express.js
- PostgreSQL
- Sequelize
- dotenv for configuration

-  Database Schema
-      Field   | Type     |

  users table:
   
  id       SERIAL PRIMARY KEY 
  name     VARCHAR  
  email    VARCHAR UNIQUE

events table:

  Field     | Type         

  id         SERIAL PRIMARY KEY 
 title      VARCHAR      
 dateTime   TIMESTAMP    
 location   VARCHAR      
 capacity   INTEGER      

 registrations table:

      Field   | Type    |

 id       SERIAL PRIMARY KEY 
 userId   INTEGER REFERENCES users(id) 
 eventId  INTEGER REFERENCES events(id) 

 API Routes-

      Create a User-
           POST /api/users/

               Request Body:
                {
                 "name": "Ritesh",
                "email": "ritesh@example.com"
                  }


         Create an Event-

             POST /api/events

                  Request Body:
                      {
                         "title": "Tech Conference 2025",
                          "dateTime": "2025-08-15T09:00:00Z",
                           "location": "Convention Center",
                            "capacity": 200
                      }   

           Get Event with Registered Users-

                GET /api/events/1
                        Response:
                             {
                                    "id": 1,
                                 "title": "Tech Conference 2025",
                                "dateTime": "2025-08-15T09:00:00Z",
                                "location": "Convention Center",
                                   "capacity": 200,
                               "registrations": [
                                                     {
                                                        "id": 1,
                                                    "name": "Ritesh",
                                                 "email": "ritesh@example.com"
                                                   }
                                              ]
                              }


                   Register User to Event-

                          POST /api/events/1/register
                                    
                                            Request Body:
                                                         {
                                                            "userId": 1
                                                        
                                                      }


                Unregister User from Event-
                 
                            DELETE api/events/eventid/registrations/userid

                 Get Event Statistics-
                               GET /api/events/1/stats

                                             Response:
                                                   {
                                                       "totalRegistrations": 32,
                                                           "remainingCapacity": 168,
                                                        "percentageUsed": "16%"
                                                    }


                             

                                   

                     
                                 

                
        


