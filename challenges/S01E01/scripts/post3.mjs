import fs from 'node:fs'
export default async function run(page) {
  const msg = fs.readFileSync('/private/tmp/claude-501/-Users-kamilnowosad-Desktop-MEGA/38f7f365-15b3-4024-b987-68237948f7d7/scratchpad/short.txt','utf8')
  const req = JSON.stringify({ from: 'rook', compactedMessage: msg })
  const res = await page.evaluate(async (b) => {
    const r = await fetch('/challenges/where-the-story-begins/api', { method: 'POST', headers: {'content-type':'application/json'}, body: b })
    return { status: r.status, text: await r.text() }
  }, req)
  fs.appendFileSync('/Users/kamilnowosad/Desktop/MEGA/s01e01-log.md', `## POST 3 (compacted, ${msg.length} chars)\nbody:\n\`\`\`json\n${req}\n\`\`\`\nreply: HTTP ${res.status}\n\`\`\`\n${res.text}\n\`\`\`\n\n`)
  return { len: msg.length, res }
}
