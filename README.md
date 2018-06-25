### Book Management API

#### Objective

To build a book management application with APIs and provide a UI throuh
which the following are implemented:

- Add book

- List all books

- Display book for a given book id

- Delete a book

- Edit properties of a book

- Search books using book attributes(Ex: all books by author)

#### Libraries used

1. Express.js - handlers for requests, define routes & add middlewares.

2. Istanbul - for code coverage

3. Eslint - for reporting and fixing styling, errors and enforcing coding standards.

4. Supertest - for testing http servers.

5. Http-Status-Codes - for providing a user-readable way of returning status codes.

6. Swagger - API documentation

7. mongoose - Mongodb object modelling for the book schema

8. method-override - to support all HTTP verbs from the UI

9. passport - for user authentication 

10. morgan - for logging HTTP requests

11. ejs - for rendering the templates in UI

12. gulp - automating repeated tasks

13. faker - To fetch fake images for book cover

14. chai - Assertion framework

15. chai-http - HTTP integration testing with Chai assertions.




#### API Documentation: 

1. Clone the git repository.
2. Run 'npm install'.
3. Run 'gulp'.
4. From the browser, go to 'localhost:4000/api-docs'.
5. For modification through UI go to 'localhost:4000' or 'localhost:4000/books'



#### Unit Test Report & Code Coverage: 
istanbul cover node_modules/.bin/_mocha src/tests/*.js

```
  Auth Controller Tests
    authenticateUser
      ✓ should not allow a user to be logged in if user credentials are wrong
      ✓ should allow a user to be logged in if user creds are correct
    addNewUser
      ✓ should not allow a user to be created if user already exists
      ✓ should allow a user to be created if user not already exists
    signInPage
      ✓ should render index page
    signUpPage
      ✓ should render singUp page

  User Crud Test for BookAPI
    ✓ Should search for a book which is not listed
    ✓ Should search for a book
    ✓ Get the list of books and match the bookname added
    ✓ Should put book
    ✓ List the single book requested
    ✓ Should allow a book to be added
    ✓ Should not allow a book to be added if title is missing
    ✓ Should delete the book added

  Book App Controller Tests
    Post
      ✓ should not allow a empty name on post
    Patch
      ✓ should allow patch- edit single

  User Crud Test
    ✓ Should render Signin page for root access
    ✓ Should search for a book which is not listed
    ✓ Should search for a book
    ✓ Get the list of books and match the bookname added
    ✓ Should edit a book with PUT method in body
    ✓ List the single book requested
    ✓ Should allow a book to be added
    ✓ Should delete the book added


  24 passing (324ms)

=============================================================================
Writing coverage object [/Users/kabinaya/Documents/BookManagement/BookManagement/coverage/coverage.json]
Writing coverage reports at [/Users/kabinaya/Documents/BookManagement/BookManagement/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 74.36% ( 290/390 )
Branches     : 47.41% ( 64/135 )
Functions    : 89.47% ( 34/38 )
Lines        : 74.36% ( 290/390 )
================================================================================

```
