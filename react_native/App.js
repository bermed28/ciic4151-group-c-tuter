import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootStackScreenComponent from "./src/screens/root_screens/RootStackScreenComponent";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const App = () => {
  return (
      <NavigationContainer theme={navTheme}>
        <RootStackScreenComponent/>
      </NavigationContainer>
  );
}

export default App;
