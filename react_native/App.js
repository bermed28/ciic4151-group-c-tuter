import { StatusBar } from 'expo-status-bar';
import {ImageBackground, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootStackScreenComponent from "./src/screens/RootStackScreenComponent";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  return (
      <NavigationContainer theme={navTheme}>
          <RootStackScreenComponent/>
      </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
