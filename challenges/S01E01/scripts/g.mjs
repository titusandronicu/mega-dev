import fs from 'node:fs'
export default async function run(page) {
  const res = await page.evaluate(async () => {
    const r = await fetch('/challenges/where-the-story-begins/api/schema.json')
    return { status: r.status, text: await r.text() }
  })
  fs.appendFileSync('/Users/kamilnowosad/Desktop/MEGA/s01e01-log.md', `## GET schema.json\nreply: HTTP ${res.status}\n\`\`\`\n${res.text}\n\`\`\`\n\n`)
  return res
}
