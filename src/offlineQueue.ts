import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY='placement-hq-offline-queue-v1';
const CONFLICT_KEY='placement-hq-sync-conflicts-v1';
export type QueuedMutation={id:string;table:string;action:'insert'|'update'|'delete';payload:Record<string,unknown>;createdAt:string};
export type SyncConflict={mutation:QueuedMutation;detectedAt:string;message:string};
export class SyncConflictError extends Error{constructor(message='This record changed on another device. Reload it before making your edit again.'){super(message);this.name='SyncConflictError'}}
async function read(){const raw=await AsyncStorage.getItem(KEY);return(raw?JSON.parse(raw):[])as QueuedMutation[]}
async function readConflicts(){const raw=await AsyncStorage.getItem(CONFLICT_KEY);return(raw?JSON.parse(raw):[])as SyncConflict[]}
async function saveConflict(mutation:QueuedMutation,message:string){const conflicts=await readConflicts();conflicts.unshift({mutation,detectedAt:new Date().toISOString(),message});await AsyncStorage.setItem(CONFLICT_KEY,JSON.stringify(conflicts.slice(0,50)))}
export async function queueMutation(table:string,action:QueuedMutation['action'],payload:Record<string,unknown>){const items=await read();items.push({id:`${Date.now()}-${Math.random()}`,table,action,payload,createdAt:new Date().toISOString()});await AsyncStorage.setItem(KEY,JSON.stringify(items))}
export async function pendingMutations(){return read()}
export async function pendingConflicts(){return readConflicts()}
export async function flushQueuedMutations(execute:(m:QueuedMutation)=>Promise<void>){const items=await read(),remaining:QueuedMutation[]=[];let conflicts=0;for(const item of items){try{await execute(item)}catch(error){if(error instanceof SyncConflictError){await saveConflict(item,error.message);conflicts++;continue}remaining.push(item)}}await AsyncStorage.setItem(KEY,JSON.stringify(remaining));return{flushed:items.length-remaining.length-conflicts,pending:remaining.length,conflicts}}
