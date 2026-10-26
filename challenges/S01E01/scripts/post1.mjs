import fs from 'node:fs'
export default async function run(page, ui) {
  const m = await page.evaluate(() => {
    const a = document.querySelector('article[aria-label="A message from Rook"], article')
    const ps = [...a.querySelectorAll('p')].map(p => p.innerText.trim())
    const dds = [...a.querySelectorAll('dd')].map(d => d.innerText.trim())
    return { ps, dds }
  })
  const body = { from: m.dds[0], to: m.dds[1], sent: m.dds[2], subject: m.dds[3], body: m.ps.join('\n\n') }
  const reqStr = JSON.stringify(body)
  const res = await page.evaluate(async (b) => {
    const r = await fetch('/challenges/where-the-story-begins/api', { method: 'POST', headers: {'content-type':'application/json'}, body: b })
    return { status: r.status, text: await r.text() }
  }, reqStr)
  const log = '/Users/kamilnowosad/Desktop/MEGA/s01e01-log.md'
  fs.appendFileSync(log, `## POST 1 (full message)\nbody (${reqStr.length} chars JSON, ${body.body.length} chars body):\n\`\`\`json\n${reqStr}\n\`\`\`\nreply: HTTP ${res.status}\n\`\`\`\n${res.text}\n\`\`\`\n\n`)
  return { reqLen: reqStr.length, bodyLen: body.body.length, res }
}
