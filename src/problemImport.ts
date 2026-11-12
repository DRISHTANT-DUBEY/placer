import type { Outcome } from './db';

export type ImportedAttempt={problem_title:string;platform:'leetcode'|'neetcode'|'other';topic:string;difficulty:'easy'|'medium'|'hard';outcome:Outcome;notes:string};
const outcomes=new Set<Outcome>(['independent','hint','solution','unsolved']);
export function parseAttemptCsv(source:string):ImportedAttempt[]{
  const lines=source.trim().split(/\r?\n/).filter(Boolean);if(!lines.length)return[];
  const start=/problem|title/i.test(lines[0])?1:0;
  return lines.slice(start).map(line=>{const [problem,platform='leetcode',topic='Imported',difficulty='medium',outcome='independent',notes='']=line.split(',').map(x=>x.trim());return{problem_title:problem,platform:(['leetcode','neetcode','other'].includes(platform.toLowerCase())?platform.toLowerCase():'other')as ImportedAttempt['platform'],topic,difficulty:(['easy','medium','hard'].includes(difficulty.toLowerCase())?difficulty.toLowerCase():'medium')as ImportedAttempt['difficulty'],outcome:(outcomes.has(outcome.toLowerCase()as Outcome)?outcome.toLowerCase():'independent')as Outcome,notes}}).filter(x=>x.problem_title);
}
