import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfiniteGame from './src/screens/InfiniteGame';
//import NewGame from './src/screens/NewGame'


const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
       <InfiniteGame/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  container: {
    flex:1,
    
  },
});
