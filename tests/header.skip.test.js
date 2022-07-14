//This test use de a new class from ./helpers/pageClass
//But always get a "Cannot read private member from an object whose class did not declare it" Error
//This error is declarer in node_modules/puppeteer/lib/cjs/puppeteer/common/Page.js:25:94
//So the proxy cant really access to the properties of page/browser
const { CustomPage } = require("./helpers/pageClass");

let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test.only("bran-logo has the correct text", async () => {
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
