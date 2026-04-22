import { useState } from "react";
import { View } from "react-native";
import { Card, TextInput, Button, Text, HelperText } from "react-native-paper";

export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null);

    const login = async() => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            console.log('Login ', response)
            if (!response) setError('Echec de connexion')
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