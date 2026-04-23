import { useContext, useState } from "react";
import { View } from "react-native";
import { Card, TextInput, Button, Text, HelperText } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    user: {}
}

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useContext(UserContext);

    const login = async() => {
        try {
            const response = await fetch('https://palace-ramble-champion.ngrok-free.dev/login', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            console.log('Login ', response)
            if (!response) setError('Echec de connexion')
            setError(null)
            const { token } = await response.json();
            await AsyncStorage.setItem('token', token)
            const { user } = jwtDecode<JwtPayload>(token)
            setUser(user);
        } catch(err: any) {
            console.log('Login error', err)
            setError(err.message)
        }
    }
    
    return (
        <View>
            <Card>
                <Card.Content>
                    <Text>Connexion</Text>
                    <TextInput
                        label="Identifiant"
                        onChangeText={setUsername}
                    />
                    <TextInput
                        label="Mot de passe"
                        onChangeText={setPassword}
                    />
                    <HelperText type="error" visible={Boolean(error)}>
                        {error}
                    </HelperText>
                    <Button
                        mode="contained"
                        onPress={login}
                    >
                        Se connecter
                    </Button>
                </Card.Content>
            </Card>
        </View>
    )
}