import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; 

type Headers = {
    Accept: string,
    'Content-type': string,
    Authorization?: string
}

export default async function fetchData(path: string, method: string, body?: object, useToken?: boolean) {
    const token = await AsyncStorage.getItem('token');
    const endpoint = 'https://palace-ramble-champion.ngrok-free.dev';
    const headers: Headers = {
        'Accept': 'application/json',
        'Content-type': 'application/json',
    }
    if(token !== undefined){
        headers['Authorization'] = 'Bearer ' + token
    }
    return fetch(endpoint, {
      headers,
      method,
      ...(body && method !== 'GET' ? {body: JSON.stringify(body)} : {})
    }).then(async response => {
      if (response.status === 401 || response.status === 403) {
        console.log('Error, access denied !')
        router.push({ pathname: '/login'});
        return;
      }
      return response.json()
    }).catch(error => {
      console.log('Error on fetch, ' +error.message)
      return 'Error on fetch, ' +error.message;
    })
}