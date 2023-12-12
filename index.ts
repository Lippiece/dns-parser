import puppeteer from "puppeteer"

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  headless: "new",
  timeout: 3000,
  waitForInitialPage: true,
})

try {
  const page = await browser.newPage()

  await page.setRequestInterception(true)

  const blockedRequestTypes = [
    "image",
    "stylesheet",
    "font",
  ]

  page.on("request", async (request) => {
    if (blockedRequestTypes.includes(request.resourceType())) {
      await request.abort()
      console.log(request.url(), "is aborted")
    } else {
      await request.continue()
    }
  })
  await page.goto("https://www.dns-shop.ru/catalog/17a8d26216404e77/vstraivaemye-xolodilniki/")

  console.log(await page.evaluate(() => document.body.innerHTML))

  const listings = await page.$$eval("a.catalog-product__name > span", (elements) => elements.map((element) => element.textContent))

  // log something from the page
  console.log(listings)


} catch (error) {
  console.error(error)
} finally {
  await browser.close()
}