import * as SplashScreen from "expo-splash-screen";
import {TodoScreen} from "@/features/TodoScreen";
import {PaperProvider} from "react-native-paper";
import {MockNetworkState} from "@/shared/MockNetworkState";
import {ApiQueryProvider} from "@/shared/ApiQuery";

SplashScreen.hideAsync();

export default function Root() {
    return (
        <ApiQueryProvider>
            <PaperProvider>
                <MockNetworkState />
                <TodoScreen/>
            </PaperProvider>
        </ApiQueryProvider>

    );
}