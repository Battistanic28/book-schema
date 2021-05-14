process.env.NODE_ENV = "test"; 
const request = require("supertest");
const app = require("../app");
const db = require("../db");



beforeEach(async function() {
    let result = await db.query(`
        INSERT INTO books 
        (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES
        ('0691161518', 'http://a.co/eobPtX2', 'Matthew Lane', 'english', 267, 'Princeton University Press', 'Power-Up: Unlocking the Hidden Mathematics in Video Games', 2017)`)
})


afterEach(async function() {
    await db.query("DELETE FROM books");
})

afterAll(async function() {
    await db.end();
});


describe("GET /", function() {
    test("Gets list of all books.", async function() {
    const response = await request(app).get("/books");
    expect(response.body).toEqual({"books": [{"amazon_url": "http://a.co/eobPtX2", "author": "Matthew Lane", "isbn": "0691161518", "language": "english", "pages": 267, "publisher": "Princeton University Press", "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games", "year": 2017}]});
    })
})

describe("DELETE /:id", function() {
    test("Deletes book based on isbn number.", async function() {
    const response = await request(app).delete("/books/0691161518");
    expect(response.body).toEqual({
        "message": "Book deleted"
      });
    })
})

describe("PUT /:id", function() {
    test("Updates book specified by isbn number.", async function() {
    const response = await request(app).put("/books/0691161518").send({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobTEST",
        "author": "Matthew TEST Lane",
        "language": "testlish",
        "pages": 267,
        "publisher": "TEST University Press",
        "title": "Power-Up: Testing the Hidden Mathematics in Video Games",
        "year": 2017
      });
    expect(response.body).toEqual({
        "book": {
          "isbn": "0691161518",
          "amazon_url": "http://a.co/eobTEST",
          "author": "Matthew TEST Lane",
          "language": "testlish",
          "pages": 267,
          "publisher": "TEST University Press",
          "title": "Power-Up: Testing the Hidden Mathematics in Video Games",
          "year": 2017
        }
      });
    })
})