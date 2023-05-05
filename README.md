# Daily Diet 

In this API you should be able to:
- create a new meals
- update meals by id
- list all meals
- list meal by id
- delete meal by id

*The authentication works with local cookies, so if you clean your cookies you probably lose all your meals. In the future, i'll improve the authentication method until this come to enjoy 😊

## Routes

### Meals

**POST /meals**
<p>Body Example:</p>

```json
{
	"name": "Meal",
	"description": "It's a good meal",
	"date_hour": "2023-05-02T07:15:44.440Z",
	"within_dietary": true
}
```
<p>Response Example:</p>
<p>Status: 200</p>

**PATCH /meals**
<p>Body Example:</p>

```json
{
	"name": "Meal #01",
	"description": "It's a good meal #01",
	"date_hour": "2023-05-02T07:15:44.440Z",
	"within_dietary": true
}
```
*At least one field must be updated

<p>Response Example:</p>
<p>Status: 200</p>

**GET /meals/:id**\
<p>No body</p>
<p>Response Example:</p>
<p>Status: 200</p>

```json
{
	"name": "Meal #01",
	"description": "It's a good meal #01",
	"date_hour": "2023-05-02T07:15:44.440Z",
	"within_dietary": true
}
```

**GET /meals**
<p>No body</p>
<p>Response Example:</p>
<p>Status: 200</p>

```json
[
  {
    "name": "Meal #01",
    "description": "It's a good meal #01",
    "date_hour": "2023-05-02T07:15:44.440Z",
    "within_dietary": true
  }
]
```
**DELETE /meals/:id**
<p>Response Example:</p>
<p>Status: 200</p>

## Developement Log
### Functional Requirements

- [x] Should be able to create a user
- [x] Should be able to identify the user between requests
- [x] Should be able to create meals that you've eaten
  - name
  - description
  - date and hour - when you ate the meal
  - within dietary
- [x] Should be able to update a meal with the above information
- [x] Should be able to delete a meal
- [x] Should be able to list the user's meals
- [x] Should be able to list a specific meal
- [x] Should be able to get user metrics
  - Total of meals
  - Total of meals within dietary
  - Total of meals out dietary
  - Longest streak with a meal within dietary
    - Every day when you ate a meal within dietary
  
### Business rules

- [x] The user should be able to list, update and delete his meals
  
### Non-functional Requirements

- [x] Use cookies to identify each user between requests
- [x] Create tests for Meal Routes