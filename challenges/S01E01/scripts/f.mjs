export default async function run(page, ui) {
  await page.getByRole('button', {name: 'open the form'}).click()
  await page.waitForTimeout(1500)
  return { main: await page.locator('main').innerText(), snap: await ui.snapshot() }
}
