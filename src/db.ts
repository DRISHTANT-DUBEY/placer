import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(url && key);
export const supabase = configured ? createClient(url!, key!, { auth: { ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}), autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }) : null;

if (supabase && Platform.OS !== 'web') AppState.addEventListener('change', (state) => state === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh());

export type Outcome = 'independent' | 'hint' | 'solution' | 'unsolved';
export type DsaAttempt = { id: string; problem_title: string; platform: 'leetcode' | 'neetcode' | 'other'; topic: string; difficulty: 'easy' | 'medium' | 'hard'; outcome: Outcome; duration_minutes: number | null; is_first_attempt: boolean; is_revision: boolean; attempted_at: string; notes: string | null };
export type Application = { id: string; company_name: string; role: string; status: string; applied_at: string; next_follow_up: string | null };
export type Recruiter = { id: string; name: string; company_name: string | null; email: string | null; phone: string | null; status: string; next_follow_up: string | null };
export type LearningProgress = { id: string; curriculum: string; external_id: string; title: string; milestone: string; confidence: number; updated_at: string };

function client() { if (!supabase) throw new Error('Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY first.'); return supabase; }
export async function listAttempts() { const { data, error } = await client().from('dsa_attempts').select('*').order('attempted_at', { ascending: false }).limit(100); if (error) throw error; return (data ?? []) as DsaAttempt[]; }
export async function addAttempt(input: Omit<DsaAttempt, 'id' | 'attempted_at'>) { const { error } = await client().from('dsa_attempts').insert(input); if (error) throw error; }
export async function listApplications() { const { data, error } = await client().from('applications').select('id,company_name,role,status,applied_at,next_follow_up').order('applied_at', { ascending: false }); if (error) throw error; return (data ?? []) as Application[]; }
export async function addApplication(input: Pick<Application, 'company_name' | 'role' | 'status' | 'next_follow_up'>) { const { error } = await client().from('applications').insert(input); if (error) throw error; }
export async function listRecruiters() { const { data, error } = await client().from('recruiters').select('id,name,company_name,email,phone,status,next_follow_up').order('updated_at', { ascending: false }); if (error) throw error; return (data ?? []) as Recruiter[]; }
export async function addRecruiter(input: Omit<Recruiter, 'id'>) { const { error } = await client().from('recruiters').insert(input); if (error) throw error; }
export async function listLearning() { const { data, error } = await client().from('learning_progress').select('*').order('updated_at', { ascending: false }); if (error) throw error; return (data ?? []) as LearningProgress[]; }
export async function upsertLearning(input: Pick<LearningProgress, 'curriculum' | 'external_id' | 'title' | 'milestone' | 'confidence'>) { const { error } = await client().from('learning_progress').upsert(input, { onConflict: 'user_id,curriculum,external_id' }); if (error) throw error; }
export function subscribeToTrackerChanges(onChange: () => void) { if (!supabase) return () => {}; const channel = supabase.channel('placement-hq-sync').on('postgres_changes', { event: '*', schema: 'public' }, onChange).subscribe(); return () => { supabase.removeChannel(channel); }; }
