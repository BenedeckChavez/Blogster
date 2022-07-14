/*
This test use de prototype functions in the class Page of puppeteer - @link ./helpers/pagePrototype
*/
const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

describe("When logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const text = await page.getContentsOf("form label");
    expect(text).toEqual("Blog Title");
  });

  describe("And using valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title input", "My title");
      await page.type(".content input", "My content");
      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");

      expect(text).toEqual("Please confirm your entries");
    });

    test("Submitting then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitForSelector(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("My title");
      expect(content).toEqual("My content");
    });
  });

  describe("And using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When NOT logged in", () => {
  test("User cannot create blog posts", async () => {
    const result = await page.postRequest("/api/blogs", {
      title: "My Title",
      content: "My Content",
    });

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("User cannot get blogs", async () => {
    const result = await page.getRequest("/api/blogs");

    expect(result).toEqual({ error: "You must log in!" });
  });
});
