import type {Content} from './content'
// Badges are derived from progress, so they need no extra database writes and stay consistent across devices.
export const earned=(c:Content,done:Set<string>)=>{
 const ids=c.lessons.flatMap(l=>l.steps.map(s=>s.id)),n=ids.filter(i=>done.has(i)).length
 return new Set(c.achievements.filter(a=>{const[k,v]=a.criteria.split(':')
  if(k==='steps')return n>=Number(v)
  if(k==='lesson'){const l=c.lessons.find(x=>x.slug===v);return!!l&&l.steps.every(s=>done.has(s.id))}
  return k==='all'&&ids.length>0&&n===ids.length}).map(a=>a.slug))}
