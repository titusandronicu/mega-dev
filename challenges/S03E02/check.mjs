import {readdirSync,readFileSync} from 'node:fs';
const dir=process.argv[2]; const errs=[]; const srcs=new Set(); const reqs=[]; const keys=new Set();
const files=readdirSync(dir).filter(f=>f.endsWith('.md')).map(f=>{const t=readFileSync(dir+'/'+f,'utf8');const m=t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);const fm={};for(const l of m[1].split('\n')){const k=l.match(/^([\w-]+):\s*(.*)$/);if(k)fm[k[1]]=k[2];}return {f,fm,body:m[2]};});
const list=s=>s?s.replace(/[\[\]]/g,'').split(',').map(x=>x.trim()).filter(Boolean):[];
for(const {f,fm,body} of files){keys.add(fm.key);list(fm.sources).forEach(s=>srcs.add(s));
 const labels=list(fm.labels); const marks=labels.filter(l=>l==='agent-ready'||l==='needs-human');
 if(fm.key+'.md'!==f) errs.push(f+': key/file mismatch');
 if(fm.status==='open'){ if(marks.length!==1) errs.push(f+': open needs exactly 1 mark');
  if(marks[0]==='agent-ready'){ if(!/## Acceptance/.test(body)||!/## Boundaries/.test(body)||!/Allowed by AUT-1/.test(body)) errs.push(f+': agent-ready body incomplete'); if(!/must not|not /i.test(body.split('## Boundaries')[0].split('## Acceptance')[1]||'')) errs.push(f+': no negative case');}
  if(marks[0]==='needs-human'){ const o=(body.match(/^\d\. /gm)||[]).length; if(o<2||!/## Recommendation/.test(body)||!/## Why/.test(body)||!/## Question/.test(body)) errs.push(f+': needs-human incomplete');}
 } else if(fm.status==='closed'){ if(!['duplicate','obsolete','contradicts-spec','not-planned'].includes(fm.reason)) errs.push(f+': closed w/o reason'); if(fm.reason==='duplicate'&&!fm['duplicate-of']) errs.push(f+': no duplicate-of'); if(!/(DES|PRD|AUT|ADR|SCHED|IN)-?\d+/.test(body)) errs.push(f+': closed w/o cite');
  if(marks.length) errs.push(f+': closed but marked');
 }
 if(fm['duplicate-of']&&![...files].some(x=>x.fm.key===fm['duplicate-of'])) errs.push(f+': duplicate-of missing target');
 if(fm.key.startsWith('IN-')) reqs.push(fm.key);
}
for(const r of reqs) if(!srcs.has(r)) errs.push('request not in any sources: '+r);
console.log(files.length+' files, '+reqs.length+' requests, '+files.filter(x=>x.fm.status==='open').length+' open');
console.log(errs.length?errs.join('\n'):'CHECK OK');
