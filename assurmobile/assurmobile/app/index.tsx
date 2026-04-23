import { StyleSheet, ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { useRouter, Redirect, useRootNavigationState } from "expo-router";
import { Button, Card, Text, ActivityIndicator, Chip, Divider } from "react-native-paper";
import { useCurrentUser } from "@/contexts/UserContext";
import fetchData from "@/hooks/fetchData";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type SinistreType = {
  id: number | string,
  plate?: string,
  sinister_datetime?: any,
  context?: string
}

export default function Index() {
  const router = useRouter()
  const [ sinistres, setSinistres ] = useState<SinistreType[]>();
  const [ loading, setLoading ] = useState(true);
  const rootNavigationState = useRootNavigationState();
  const { user } = useCurrentUser();

  useEffect(() => {
    setLoading(true);
    fetchData('/sinistre', 'GET', {}, true)
    .then(data => {
      const { sinistres } = data
      console.log(sinistres)
      setSinistres(sinistres || [])
      console.log('DATA LOADED', data)
    })
    .catch(err => {
      console.log('Error on fetch sinistre' + err.message)
      setSinistres([])
    })
    .finally(() => setLoading(false))
  }, [])

  if (!user) {
    return <Redirect href="/login"/>
  }

  if(rootNavigationState?.key) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bienvenue, {user?.firstname || 'Utilisateur'}!</Text>
          <Text style={styles.subtext}>Gérez vos sinistres automobiles</Text>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons 
                name="file-document" 
                size={32} 
                color="#0066CC" 
              />
              <Text style={styles.statNumber}>{sinistres?.length || 0}</Text>
              <Text style={styles.statLabel}>Sinistres</Text>
            </Card.Content>
          </Card>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Chargement des sinistres...</Text>
          </View>
        ) : sinistres && sinistres.length > 0 ? (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Vos sinistres</Text>
            {sinistres?.map((sinistre: SinistreType, index: number) => (
              <View key={sinistre.id}>
                <Card 
                  style={styles.card}
                  onPress={() => router.push({ pathname: '/sinistre/[id]', params: { id: sinistre.id }})}
                >
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleContainer}>
                        <MaterialCommunityIcons 
                          name="car-crash" 
                          size={24} 
                          color="#0066CC" 
                          style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>Sinistre n°{sinistre.id}</Text>
                      </View>
                      <Chip 
                        icon="information" 
                        style={styles.chip}
                        textStyle={styles.chipText}
                      >
                        En cours
                      </Chip>
                    </View>

                    <Text style={styles.context} numberOfLines={2}>
                      {sinistre.context || 'Aucun contexte fourni'}
                    </Text>

                    <Divider style={styles.divider} />

                    <View style={styles.detailsGrid}>
                      <View style={styles.detailItem}>
                        <MaterialCommunityIcons 
                          name="license-plate" 
                          size={18} 
                          color="#666"
                        />
                        <Text style={styles.detailLabel}>Véhicule</Text>
                        <Text style={styles.detailValue}>{sinistre.plate || 'N/A'}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <MaterialCommunityIcons 
                          name="calendar" 
                          size={18} 
                          color="#666"
                        />
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>
                          {sinistre.sinister_datetime 
                            ? new Date(sinistre.sinister_datetime).toLocaleDateString('fr-FR')
                            : 'N/A'
                          }
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                    <Button
                      icon="arrow-right"
                      mode="contained"
                      onPress={() => router.push({ pathname: '/sinistre/[id]', params: { id: sinistre.id }})}
                      style={styles.actionButton}
                      labelStyle={styles.actionButtonLabel}
                    >
                      Accéder
                    </Button>
                  </Card.Actions>
                </Card>
                {index < sinistres.length - 1 && <View style={styles.spacer} />}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons 
              name="inbox-outline" 
              size={64} 
              color="#CCC" 
            />
            <Text style={styles.emptyTitle}>Aucun sinistre</Text>
            <Text style={styles.emptyText}>
              Vous n'avez pas encore de sinistres déclarés
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }

  return <ActivityIndicator animating={true} size="large" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    elevation: 4,
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066CC',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    paddingBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chip: {
    backgroundColor: '#E3F2FD',
  },
  chipText: {
    color: '#0066CC',
    fontSize: 12,
  },
  context: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  divider: {
    marginVertical: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  cardActions: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    borderRadius: 8,
  },
  actionButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  spacer: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
    textAlign: 'center',
  },
})

