import React, {useEffect, useState, useRef} from "react"
import { StyleSheet, View, Text } from 'react-native'
import MapView,{Marker} from "react-native-maps"
import * as Location from 'expo-location'

export default function App(){
  
  const[location,setLocation] = useState(null)
  const[errorMsg, setErrorMsg] = useState(null)
  const mapRef = useRef(null)

  useEffect(()=>{
    (async () => {

      let {status} = await Location.requestForegroundPermissionsAsync()
      if(status !== 'granted'){
        setErrorMsg('A permissão para acessar a localizaçao foi negada')
        return
      }
      const subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval:1000,
        distanceInterval:1
      },
      (newLocation) =>{
        const{latitude, longitude} = newLocation.coords
        setLocation({latitude, longitude})
      }
      )

    })()
  },[])
  
  return(
    <View>

    </View>
  )
}