# ReadAloud Backend

## Installation Guide
Run `npm install` to install all required node packages

Run `node server.js` to run the server on localhost port 8081

## Remarks

- HTTPS requests can be sent to the server based on the API specified in the [Interface Specification Document](https://docs.google.com/spreadsheets/d/1gNJLbXxi0g_cgOnHEjXZEuWhSY55yiNT/edit?usp=sharing&ouid=108168860311561889311&rtpof=true&sd=true)
  - Some sample data is located on the second tab of the document, if you wish to send your own HTTPS requests.

- Testing of the API is documented in the Test Case Document.


## Project Structure
`server.js` is the entry point of the application

`app/config` contains the database url to be used with the application

`app/routes` contains files which define the endpoints of the API, encapsulated by area of concern

`app/models` contains the files which define database schemas for the "tables" within the MongoDB database, encapsulated by area of concern

`app/controllers` contains the files which define the business logic of the application, in the form of functions to be executed when the corresponding endpoint receives a request. Also encapsulated by area of concern.

## Hosting
Our backend server is hosted on **Heroku**.
Any changes made to the source codes will need to be published and uploaded to our heroku repository in order to facilitate the change.
