import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { colors } from "@/constants/theme";

export default function AuthenticatedLayout() {

  const { signed, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!signed && !loading) {
      router.replace("/login");
    }
  }, [signed, loading]);

  if (loading || !signed) {
    return null;
  }

  return (
    <Stack screenOptions={{
      headerShown: true, headerStyle: {
        backgroundColor: colors.background
      }, headerTitleStyle: {
        fontWeight: '600',
      }, headerTintColor: colors.primary,
      headerShadowVisible: false
    }}>
      <Stack.Screen 
      name="dashboard" 
      options={{ 
        headerBackButtonDisplayMode: 'minimal', 
        headerShown: false }} />
      <Stack.Screen name="order" options={{
        headerBackButtonDisplayMode: 'minimal', 
        headerShown: false }} />
      <Stack.Screen 
      name="finish" 
      options={{
        headerBackButtonDisplayMode: 'minimal', 
        headerShown: true, 
        headerTitle: "Finalizar pedido"
        }} />
    </Stack>
  )
}