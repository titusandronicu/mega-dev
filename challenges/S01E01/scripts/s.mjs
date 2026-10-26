export default async function run(page, ui) {
  await ui.click('@e3')
  await page.waitForTimeout(3000)
  return { url: page.url(), snap: await ui.snapshot() }
}
