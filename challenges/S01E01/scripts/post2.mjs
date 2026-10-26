import fs from 'node:fs'
export default async function run(page) {
  const ps = await page.evaluate(() => [...document.querySelectorAll('article p')].map(p => p.innerText.trim()))
  const msg = ps.join('\n\n')
  fs.writeFileSync('/Users/kamilnowosad/Desktop/MEGA/s01e01-rook-full.txt', msg)
  const req = JSON.stringify({ from: 'rook', compactedMessage: msg })
  const res = await page.evaluate(async (b) => {
    const r = await fetch('/challenges/where-the-story-begins/api', { method: 'POST', headers: {'content-type':'application/json'}, body: b })
    return { status: r.status, text: await r.text() }
  }, req)
  fs.appendFileSync('/Users/kamilnowosad/Desktop/MEGA/s01e01-log.md', `## POST 2 (full message, schema shape)\nbody:\n\`\`\`json\n${req}\n\`\`\`\nreply: HTTP ${res.status}\n\`\`\`\n${res.text}\n\`\`\`\n\n`)
  return { paragraphs: ps.length, chars: msg.length, res }
}
