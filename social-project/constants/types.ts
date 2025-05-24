// types.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Load: undefined;
  Login: undefined;
  Index: undefined;
};

export type LoadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Load'>;