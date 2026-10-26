export default async function run(page, ui) {
  await ui.fill('@e3', 'nowosad.kamil@gmail.com')
  await ui.click('@e4')
  await page.waitForTimeout(2500)
  return await ui.snapshot({full: true})
}
