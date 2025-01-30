import * as React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Button,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/globalStyles";


WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);

 
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "841621734459-a337itpi4ot668ec613jjeijq3ljkm4f.apps.googleusercontent.com",
    iosClientId:
      "841621734459-6rord1u2ke8m2h11p9o7g48agcmkolvm.apps.googleusercontent.com",
    webClientId:
      "841621734459-urv8hs2ichtoknr5jt30nc18co0n9p55.apps.googleusercontent.com",
    //redirectUri: "project://redirect", 
    //scopes: ["openid", "profile", "email"], 
  });


  console.log("Redirect URI:", request?.redirectUri);

  
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Authentication Token:", authentication?.accessToken);
      if (authentication?.accessToken) {
        fetchUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    if (!token) {
      console.error("Access Token is missing.");
      return;
    }

    try {
      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to fetch user info:", errorDetails);
        return;
      }

      const user = await response.json();
      console.log("User Info:", user);

     
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const clearUserInfo = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUserInfo(null);
      console.log("User info cleared from AsyncStorage");
    } catch (error) {
      console.error("Error clearing user info:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Placeholder for additional UI */}
        <View style={globalStyles.circle1}></View>
        <View style={globalStyles.circle2}></View>

        {/* Display user info */}
        <Text style={styles.infoText}>
          {userInfo
            ? `Welcome, ${userInfo.name || "User"}!`
            : "Please sign in with Google"}
        </Text>

        {/* Sign-In button */}
        <Button
          title="Sign in with Google"
          onPress={() => promptAsync()}
          disabled={!request}
        />

        {/* Clear local storage button */}
        <Button
          title="Delete Local Storage"
          onPress={clearUserInfo}
          color="red"
        />

        <View style={globalStyles.circle3}></View>
        <View style={globalStyles.circle4}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  infoText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
  },
});
