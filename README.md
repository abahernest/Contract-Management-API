# Contract Management API

## Technologies

- Serverless Framework
- DynamoDB Local
- SLSPress

## STEPS TO RUN THE APP LOCALLY

1. Clone the repo and `cd` into the repo folder
2. Install dependencies by running 
```
>> npm install
```
3. In a new terminal, `cd` into the "dynamodb" folder and run `docker compose up`. (ensure docker is installed)
4. Ensure serverless framework is installed globally. 
```
>> npm install -g serverless
```
If you're not logged in as admin user, use
```
>> sudo npm install -g serverless
```
4. Start Application
```
>> sls offline start
```

## TEST
```
>> npm test
```

## POSTMAN DOCUMENTATION
[Postman Doc](https://documenter.getpostman.com/view/11044390/2s7Z15E3Ci)

## DATABASE TABLE RELATIONSHIPS

### TABLE 1: USER
    ```
        {
            userID              (uuid string)--ID index of the user
            fullname            (string)--fullname of the user
            email               (string)--email of the user
            password            (string)--password
        }
    ```

### TABLE 2: CONTRACT
    ```
        {
            contractID          (uuid string)--ID index of the contract
            templateID          (uuid string)--contract template id
            userID              (uuid string)--Foreign Key Referencing User Table
            contractName        (string)--name of the contract
        }
    ```



