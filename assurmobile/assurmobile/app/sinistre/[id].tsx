import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Switch, Text, ActivityIndicator, Divider, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import fetchData from "@/hooks/fetchData";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
  const [ loading, setLoading ] = useState(true);

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    setLoading(true);
    fetchData('/sinistre/'+id, 'GET', {}, true)
      .then(data => {
        const { sinistre } = data
        setSinistre(sinistre)
      })
      .catch(err => {
        console.log('Error on get sinistre ' + err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  if(loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    )
  }

  if(!sinistre) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons 
          name="alert-circle-outline" 
          size={64} 
          color="#D32F2F" 
        />
        <Text style={styles.errorTitle}>Sinistre introuvable</Text>
        <Text style={styles.errorText}>
          Le sinistre que vous cherchez n'existe pas ou a été supprimé
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <MaterialCommunityIcons 
            name="car-crash" 
            size={36} 
            color="#FFFFFF" 
          />
          <Text style={styles.headerTitle}>Sinistre n°{sinistre.id}</Text>
        </View>
        <Chip 
          icon="information" 
          style={styles.statusChip}
          textStyle={styles.statusChipText}
        >
          En cours de traitement
        </Chip>
      </View>

      {/* Section Information générale */}
      <Card style={styles.card}>
        <Card.Title 
          title="Information générale"
          titleVariant="titleMedium"
          left={(props) => <MaterialCommunityIcons {...props} name="information" size={24} color="#0066CC" />}
        />
        <Divider />
        <Card.Content style={styles.cardContent}>
          <DetailRow 
            icon="license-plate" 
            label="Plaque d'immatriculation" 
            value={sinistre.plate || 'N/A'}
          />
          <DetailRow 
            icon="calendar" 
            label="Date du sinistre" 
            value={sinistre.sinister_datetime 
              ? new Date(sinistre.sinister_datetime).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : 'N/A'
            }
          />
          <DetailRow 
            icon="clock-outline" 
            label="Signalement" 
            value={sinistre.call_datetime 
              ? new Date(sinistre.call_datetime).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })
              : 'N/A'
            }
          />
        </Card.Content>
      </Card>

      {/* Section Conducteur */}
      <Card style={styles.card}>
        <Card.Title 
          title="Informations du conducteur"
          titleVariant="titleMedium"
          left={(props) => <MaterialCommunityIcons {...props} name="account" size={24} color="#0066CC" />}
        />
        <Divider />
        <Card.Content style={styles.cardContent}>
          <DetailRow 
            icon="account-name" 
            label="Prénom" 
            value={sinistre.driver_firstname || 'N/A'}
          />
          <DetailRow 
            icon="account-name" 
            label="Nom" 
            value={sinistre.driver_lastname || 'N/A'}
          />
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MaterialCommunityIcons 
                name="scale-balance" 
                size={20} 
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.label}>Responsabilité</Text>
            </View>
            <Switch
              disabled
              value={sinistre.driver_responsability}
              color={sinistre.driver_responsability ? '#4CAF50' : '#999'}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Section Contexte */}
      {sinistre.context && (
        <Card style={styles.card}>
          <Card.Title 
            title="Description"
            titleVariant="titleMedium"
            left={(props) => <MaterialCommunityIcons {...props} name="note-text" size={24} color="#0066CC" />}
          />
          <Divider />
          <Card.Content style={styles.cardContent}>
            <Text style={styles.contextText}>
              {sinistre.context}
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  )
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabel}>
        <MaterialCommunityIcons 
          name={icon} 
          size={20} 
          color="#666"
          style={styles.icon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  statusChip: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
  },
  statusChipText: {
    color: '#0066CC',
    fontSize: 12,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailRow_last: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  contextText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
  },
})
