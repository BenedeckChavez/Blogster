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

test("bran-logo has the correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("click login start google auth", async () => {
  await page.click(".right a");

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When login shows logout button", async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual("Logout");
});
