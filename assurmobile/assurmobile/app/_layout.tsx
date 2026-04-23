import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper"

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0066CC',
    secondary: '#00B4D8',
    background: '#F5F7FA',
    surface: '#FFFFFF',
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0066CC',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: "Mes Sinistres",
              headerShown: true,
            }}
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              title: "Connexion",
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="sinistre/[id]" 
            options={{ 
              title: "Détails du sinistre",
              headerShown: true,
            }}
          />
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}