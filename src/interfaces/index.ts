import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface FirebaseContextType {
    user: FirebaseAuthTypes.User | null;
}