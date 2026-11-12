import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY='placement-hq-offline-queue-v1';
export type QueuedMutation={id:string;table:string;action:'insert'|'update'|'delete';payload:Record<string,unknown>;createdAt:string};
async function read(){const raw=await AsyncStorage.getItem(KEY);return(raw?JSON.parse(raw):[])as QueuedMutation[]}
export async function queueMutation(table:string,action:QueuedMutation['action'],payload:Record<string,unknown>){const items=await read();items.push({id:`${Date.now()}-${Math.random()}`,table,action,payload,createdAt:new Date().toISOString()});await AsyncStorage.setItem(KEY,JSON.stringify(items))}
export async function pendingMutations(){return read()}
export async function flushQueuedMutations(execute:(m:QueuedMutation)=>Promise<void>){const items=await read(),remaining:QueuedMutation[]=[];for(const item of items){try{await execute(item)}catch{remaining.push(item)}}await AsyncStorage.setItem(KEY,JSON.stringify(remaining));return{flushed:items.length-remaining.length,pending:remaining.length}}
