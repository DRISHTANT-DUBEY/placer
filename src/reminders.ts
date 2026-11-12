import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:false,shouldSetBadge:false})});
export async function scheduleFollowUpReminder(title:string,date:string){if(Platform.OS==='web')return null;const permission=await Notifications.requestPermissionsAsync();if(permission.status!=='granted')throw Error('Notifications permission was not granted.');const at=new Date(`${date}T09:00:00`);if(Number.isNaN(at.valueOf())||at<=new Date())return null;return Notifications.scheduleNotificationAsync({content:{title:'Placement HQ follow-up',body:title},trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:at}})}
