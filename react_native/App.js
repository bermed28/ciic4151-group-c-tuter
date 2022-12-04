import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import RootStackScreenComponent from "./src/screens/root_screens/RootStackScreenComponent";
import {LogBox} from "react-native";

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreLogs(['Possible Unhandled Promise Rejection'])
LogBox.ignoreLogs(['Constants.platform.ios.model has been deprecated in favor of expo-device\'s Device.modelName property.'])

const App = () => {
    return (
        <NavigationContainer theme={navTheme}>
            <RootStackScreenComponent/>
        </NavigationContainer>
    );
}

export default App;