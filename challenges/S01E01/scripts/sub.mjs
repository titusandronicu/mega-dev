import fs from 'node:fs'
export default async function run(page, ui) {
  const ans = 'GPT-6.1 Sol'
  await ui.fill('@e5', ans)
  const resp = page.waitForResponse(r => r.request().method() === 'POST', {timeout: 8000}).catch(() => null)
  await ui.click('@e6')
  const r = await resp
  let body = null
  if (r) body = { url: r.url(), status: r.status(), text: (await r.text()).slice(0, 1500) }
  await page.waitForTimeout(1500)
  const main = await page.locator('main').innerText()
  fs.appendFileSync(process.env.HOME + '/mega-dev/challenges/S01E01/log.md', `## FORM submit 3\nanswer: ${ans}\nnetwork: ${JSON.stringify(body)}\npage:\n\`\`\`\n${main}\n\`\`\`\n\n`)
  return { body, main }
}
