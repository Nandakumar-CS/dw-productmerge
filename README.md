# dw-productmerge
Humble attempt to write javascript/typescript for the first time :)


To run the application locally, all you have to do is to checkout the repo in local and run using "npm start" if nodejs is installed in the local

The scheduling feature is wriiten in nodejs itself and it is configured to execute for 10 second and every 10 second it will access the resources from the endpoints 
and will be merged to create an object. I have thought of writing a lambda to kick start the application using a AWS stepfunction initially to use AWS tech here, but didnt feel like an economical choice for an application when we can do the scheduling part using node-scheduler itself.

The database connection i have used is MongoDB, so inorder to connect it locally ,mongo has to be installed and up in the local instance.
The logic to save and fetch from db is intentionally missed out by me as the end point went down on saturday and to be honest still figuring out to write the database 
orm styles while writing code in javascript for backend.

Before the scheduling kickstarts once the application is up, the express server will also be up at port 3000 and the get request is exposed to display a message, as the db fetch is not implemented , the user will get a message if the url is accessed via postman on http://localhost:3000/ that "Merged Product info for Daniel Wellington is available with the response"

I have used axios to connect to the endpoints as I have a bit of familiarity with it and had a understanding that it is the default choice for developers to recieve the responses 
from endpoint as JSON.

The approach i went was to basically

1. Bring the application in a server.
2. Kick start the scheduler.
3. Scheduler calls a main function which will recieve 2 json responses from 2 endpoints
4. Call a method to implement a merging logic using the sku id in product to get the image corresponding to it and merge together
5. Save the object to database using the sku id or product id as the key.
6. A get method which gets a product id which will pass to a method, which will make a db call to fetch the json object using the id and expose it to end user.
7. close db connection

I hope this helps and would bare any concepts with regards to seperating the logics in differrent file while writing an application in typescript.
