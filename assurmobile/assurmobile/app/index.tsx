import { Pressable, Text, View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";


export default function Index() {
  const [value, onChangeTitle] = useState('test')


  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>To Edit this value : {value}.</Text>
      <Pressable
        onPress={() => {
          onChangeTitle('new Value')
        }}
      >
        <Text>Press on this link</Text>
      </Pressable>
      <Button
        onPress={() => router.navigate('/login')}
      >
        Se connecter
      </button>
    </View>
  );
}
