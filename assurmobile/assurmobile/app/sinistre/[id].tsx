import { ScrollView, View } from "react-native";
import { Card, Switch, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import fetchData from "@/hooks/fetchData";

type SinistreType = {
  id?: number | string,
  plate?: string,
  sinister_datetime?: any,
  context?: string,
  driver_firstname?: string,
  driver_lastname?: string,
  call_datetime?: any,
  driver_responsability: boolean
}

export default function SinistreDetailScreen() {
  const [ sinistre, setSinistre ] = useState<SinistreType>();

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    fetchData('/sinistre/'+id, 'GET', {}, true)
      .then(data => {
        const { sinistre } = data
        setSinistre(sinistre)
      })
      .catch(err => {
        console.log('Error on get sinistre ' + err.message)
      })
  }, [id])

  if(!sinistre) {
    return (
      <View>
        <Text>Le sinistre est introuvable !</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      <Card
        key={sinistre.id}
      >
        <Card.Title title="Mon sinistre"/>
        <Card.Content>
          <Text>Plaque : {sinistre.plate}</Text>
          <Text>Date du sinistre : {sinistre.sinister_datetime}</Text>
          <Text>Contexte : {sinistre.context}</Text>
          <Text>Prénom du conducteur : {sinistre.driver_firstname}</Text>
          <Text>Nom du conducteur : {sinistre.driver_lastname}</Text>
          <Text>Date de signalement du sinistre : {sinistre.call_datetime}</Text>
          <Text>Responsabilité du conducteur : </Text>
          <Switch
            disabled
            value={sinistre.driver_responsability}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  )
}