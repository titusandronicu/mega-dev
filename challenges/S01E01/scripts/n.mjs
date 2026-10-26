import fs from 'node:fs'
export default async function run(page, ui) {
  const log = fs.readFileSync('/Users/kamilnowosad/Desktop/MEGA/s01e01-log.md','utf8')
  const m = log.match(/"next":"([^"]+)"/)
  await page.goto(m[1])
  await page.waitForTimeout(1500)
  return { url: page.url(), snap: await ui.snapshot({full:true}) }
}
