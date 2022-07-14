const { Page } = require("puppeteer/lib/cjs/puppeteer/common/Page.js");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

Page.prototype.login = async function () {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);
  await this.setCookie({ name: "session", value: session });
  await this.setCookie({ name: "session.sig", value: sig });
  await Promise.all([
    this.goto("http://localhost:3000/blogs"),
    this.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  return this;
};

Page.prototype.getContentsOf = async function (selector) {
  return this.$eval(selector, (el) => el.innerHTML);
};

Page.prototype.getRequest = async function (path) {
  return this.evaluate((_path) => {
    return fetch(_path, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }, path);
};

Page.prototype.postRequest = async function (path, body) {
  return this.evaluate(
    (_path, _body) => {
      return fetch(_path, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(_body),
      }).then((res) => res.json());
    },
    path,
    body
  );
};
