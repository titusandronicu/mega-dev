export default async function run(page, ui) {
  const html = await page.content()
  const links = [...html.matchAll(/(?:href|src|data-[a-z-]+)="([^"]*(?:schema|attach|api)[^"]*)"/gi)].map(m=>m[1])
  return { links: [...new Set(links)], hasLine6: html.includes('line 06') }
}
