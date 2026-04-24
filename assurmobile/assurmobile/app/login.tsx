import { useContext, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, TextInput, Button, Text, HelperText, Snackbar } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import fetchData from "@/hooks/fetchData";

type JwtPayload = {
    user: {}
}

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const router = useRouter();

    const login = async() => {
        if (!username || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        setLoading(true);
        try {
            const { token } = await fetchData('/login', 'POST', { username, password }, false)
            await AsyncStorage.setItem('token', token)
            const { user } = jwtDecode<JwtPayload>(token)
            setUser(user)
            setError(null)
            router.replace('/')
        } catch(err: any) {
            console.log('Login error', err)
            setError(err.message || 'Erreur de connexion')
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.logo}>AssurMoi</Text>
                <Text style={styles.subtitle}>Gestion des sinistres automobiles</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <Text variant="headlineSmall" style={styles.title}>Connexion</Text>
                    <Text variant="bodyMedium" style={styles.description}>
                        Veuillez vous connecter pour accéder à votre compte
                    </Text>

                    <TextInput
                        label="Identifiant"
                        value={username}
                        onChangeText={setUsername}
                        mode="outlined"
                        style={styles.input}
                        disabled={loading}
                        placeholder="Entrez votre identifiant"
                    />

                    <TextInput
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        disabled={loading}
                        placeholder="Entrez votre mot de passe"
                    />

                    {error && (
                        <HelperText type="error" style={styles.error}>
                            {error}
                        </HelperText>
                    )}

                    <Button
                        mode="contained"
                        onPress={login}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        loading={loading}
                        disabled={loading}
                    >
                        Se connecter
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F5F7FA',
    },
    headerContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#0066CC',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    card: {
        marginBottom: 24,
        elevation: 4,
        borderRadius: 12,
    },
    cardContent: {
        padding: 24,
    },
    title: {
        marginBottom: 8,
        color: '#0066CC',
        fontWeight: '600',
    },
    description: {
        marginBottom: 24,
        color: '#666',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    error: {
        marginBottom: 16,
        color: '#D32F2F',
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
})

