import { StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, Redirect, useRootNavigationState } from "expo-router";
import { Button, Card, Text } from "react-native-paper";
import { useCurrentUser } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";

type SinistreType = {
  id?: any,
  plate?: string,
  sinister_datetime?: any,
  context?: string
}

export default function Index() {
  const router = useRouter()
  const [ sinistres, setSinistres ] = useState([]);
  const rootNavigationState = useRootNavigationState();
  const { user } = useCurrentUser();

  useEffect(() => {
    fetchData('/sinistres', 'GET', {}, true).then(data => {
      setSinistres(data)
      console.log('DATA LOADED', data)
    })
  }, [])

  if (!user) {
    return <Redirect href="/login"/>
  }

  if(rootNavigationState?.key) {
    return (
      <ScrollView>
        {sinistres.map((sinistre: SinistreType) => (
          <Card 
            style={styles.card}
            key={sinistre.id}>
            <Card.Title title={"Sinistre n°"+sinistre.id} subtitle={sinistre.context}/>
            <Card.Content>
              <Text variant="titleLarge">Véhicule : {sinistre.plate}</Text>
              <Text variant="bodyMedium">Soumis le : {sinistre.sinister_datetime}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => router.push({ pathname: '/sinistre/[id]' as any, params: { id: sinistre.id() }})}
              >
                Accéder au sinistre
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  }
})