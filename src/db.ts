import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { flushQueuedMutations, queueMutation } from './offlineQueue';

const url=process.env.EXPO_PUBLIC_SUPABASE_URL, key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const configured=Boolean(url&&key);
export const supabase=configured?createClient(url!,key!,{auth:{...(Platform.OS!=='web'?{storage:AsyncStorage}:{}),autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}}):null;
if(supabase&&Platform.OS!=='web')AppState.addEventListener('change',s=>s==='active'?supabase.auth.startAutoRefresh():supabase.auth.stopAutoRefresh());
const client=()=>{if(!supabase)throw Error('Configure Supabase first');return supabase};
export async function ensureSession(){const c=client();const{data:{session}}=await c.auth.getSession();if(session)return session;const{data,error}=await c.auth.signInAnonymously();if(error)throw Error('Enable Anonymous Sign-Ins in Supabase Auth → Providers.');return data.session!}
const shouldQueue=(e:any)=>/network|fetch|offline|timeout|failed to fetch/i.test(String(e?.message??e));
async function insertOrQueue(table:string,payload:Record<string,unknown>){const{error}=await client().from(table).insert(payload);if(!error)return;if(shouldQueue(error)){await queueMutation(table,'insert',payload);return}throw error}
async function updateOrQueue(table:string,id:string,payload:Record<string,unknown>){const{error}=await client().from(table).update(payload).eq('id',id);if(!error)return;if(shouldQueue(error)){await queueMutation(table,'update',{id,...payload});return}throw error}
async function deleteOrQueue(table:string,id:string){const{error}=await client().from(table).delete().eq('id',id);if(!error)return;if(shouldQueue(error)){await queueMutation(table,'delete',{id});return}throw error}
export async function flushOfflineQueue(){return flushQueuedMutations(async m=>{if(m.action==='insert'){const{error}=await client().from(m.table).insert(m.payload);if(error)throw error;return}const{id,...payload}=m.payload;if(m.action==='delete'){const{error}=await client().from(m.table).delete().eq('id',id as string);if(error)throw error;return}const{error}=await client().from(m.table).update(payload).eq('id',id as string);if(error)throw error})}
export async function householdId(){await ensureSession();const{data,error}=await client().from('household_members').select('household_id').limit(1).maybeSingle();if(error)throw error;return data?.household_id??null}
export async function createPrivateSpace(){await ensureSession();const{data,error}=await client().rpc('create_household');if(error)throw error;const x=Array.isArray(data)?data[0]:data;return{id:x.household_id as string,code:x.pairing_code as string}}
export async function joinPrivateSpace(code:string){await ensureSession();const{data,error}=await client().rpc('join_household',{code:code.trim()});if(error)throw error;return data as string}
export type Outcome='independent'|'hint'|'solution'|'unsolved';export type DsaAttempt={id:string;problem_title:string;platform:'leetcode'|'neetcode'|'other';topic:string;difficulty:'easy'|'medium'|'hard';outcome:Outcome;duration_minutes:number|null;is_first_attempt:boolean;is_revision:boolean;attempted_at:string;notes:string|null;company_tags?:string[];problem_url?:string|null};export type Application={id:string;company_name:string;role:string;status:string;applied_at:string;next_follow_up:string|null;notes?:string|null};export type Recruiter={id:string;name:string;company_name:string|null;email:string|null;phone:string|null;status:string;next_follow_up:string|null;notes?:string|null};export type DailyGoal={id:string;goal_date:string;dsa_target:number;design_target:number;notes:string|null};
export type ApplicationEvent={id:string;application_id:string;event_type:string;occurred_at:string;notes:string|null};
export type LearningProgress={id:string;curriculum:'babua'|'system_design';external_id:string;title:string;milestone:'not_started'|'read'|'understood'|'designed'|'mocked'|'revised';confidence:number;notes:string|null};
export async function listAttempts(h:string){const{data,error}=await client().from('dsa_attempts').select('*').eq('household_id',h).order('attempted_at',{ascending:false}).limit(200);if(error)throw error;return(data??[])as DsaAttempt[]}
export async function listLearning(h:string){const{data,error}=await client().from('learning_progress').select('*').eq('household_id',h);if(error)throw error;return(data??[])as LearningProgress[]}
export async function saveLearning(h:string,input:Pick<LearningProgress,'curriculum'|'external_id'|'title'|'milestone'|'confidence'|'notes'>){const{error}=await client().from('learning_progress').upsert({...input,household_id:h},{onConflict:'household_id,curriculum,external_id'});if(error)throw error}
export async function saveAttempt(h:string,input:Partial<DsaAttempt>&Pick<DsaAttempt,'problem_title'|'platform'|'topic'|'difficulty'|'outcome'>){await insertOrQueue('dsa_attempts',{...input,household_id:h})}
export async function updateAttempt(id:string,input:Partial<DsaAttempt>){await updateOrQueue('dsa_attempts',id,input)}
export async function removeAttempt(id:string){await deleteOrQueue('dsa_attempts',id)}
export async function listApplications(h:string){const{data,error}=await client().from('applications').select('*').eq('household_id',h).order('applied_at',{ascending:false});if(error)throw error;return(data??[])as Application[]}
export async function saveApplication(h:string,input:Partial<Application>&Pick<Application,'company_name'|'role'|'status'>){await insertOrQueue('applications',{...input,household_id:h})}
export async function updateApplication(id:string,input:Partial<Application>){await updateOrQueue('applications',id,input)}
export async function listApplicationEvents(h:string){const{data,error}=await client().from('application_events').select('*').eq('household_id',h).order('occurred_at',{ascending:false});if(error)throw error;return(data??[])as ApplicationEvent[]}
export async function saveApplicationEvent(h:string,input:Pick<ApplicationEvent,'application_id'|'event_type'|'occurred_at'|'notes'>){await insertOrQueue('application_events',{...input,household_id:h})}
export async function listRecruiters(h:string){const{data,error}=await client().from('recruiters').select('*').eq('household_id',h).order('updated_at',{ascending:false});if(error)throw error;return(data??[])as Recruiter[]}
export async function saveRecruiter(h:string,input:Partial<Recruiter>&Pick<Recruiter,'name'>){await insertOrQueue('recruiters',{...input,household_id:h})}
export async function listGoals(h:string){const{data,error}=await client().from('daily_goals').select('*').eq('household_id',h).order('goal_date',{ascending:false}).limit(30);if(error)throw error;return(data??[])as DailyGoal[]}
export async function saveGoal(h:string,input:Pick<DailyGoal,'goal_date'|'dsa_target'|'design_target'|'notes'>){const{error}=await client().from('daily_goals').upsert({...input,household_id:h},{onConflict:'household_id,goal_date'});if(error)throw error}
export function subscribeToTrackerChanges(onChange:()=>void){if(!supabase)return()=>{};const channel=supabase.channel('placement-hq-sync').on('postgres_changes',{event:'*',schema:'public'},onChange).subscribe();return()=>{supabase.removeChannel(channel)}}
