import { StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { Button, Crad, Text } from "react-native-paper";
import { useCurrentUser } from "@/contexts/UserContext";

export default function Index() {
  const router = useRouter();
  const [ sinistres, setSinistres ] = useState([]);
  const rootNavigationState = useRootNavigationState();
  const { user } = useCurrentUser();

  useEffect(() => {
    fetch('https://palace-ramble-champion.ngrok-free.dev/sinistres').then(async response => {
      const data = await response.json();
      if(response.status === 200) {
        setSinistres(data)
      }
      console.log('Error', data)
    }).catch(error => {
      console.log('Error', error.message)
    })
  }, [])

  if (!user) {
    return <Redirect href="/login"/>
  }

  if(rootNavigationState?.key) {
    return (
      <ScrollView>
        <Card
          style={styles.card}
        >
          <Card.Title title="Sinistre 1" subtitle="Accident impliquant un tiers"/>
          <Card.Content>
            <Text variant="titleLarge">Véhicule : AA-123-BB</Text>
            <Text variant="bodyMedium">Soumis le : 01/01/2026</Text>
          </Card.Content>
          <Card.Action>
            <Button>Accéder au sinistre</Button>
          </Card.Action>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12;
    marginLeft: 10,
    marginRight: 10,
  }
})