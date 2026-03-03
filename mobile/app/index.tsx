import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { colors } from '@/constants/theme'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';

export default function Index() {

  const { signed, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  /**O segments é um array que contém as partes da rota atual. Ex: ['index', 'dashboard'] 
   * por exemplo, se a rota atual for (authenticated)/dashboard, o segments será ['authenticated', 'dashboard']
  */

  useEffect(() => {

    if (loading) return;

    const inAuthGroup = segments[0] === "(authenticated)";

    if(!signed && inAuthGroup) {
      router.replace('/login')
    } else if (signed && !inAuthGroup) {
      router.replace('/(authenticated)/dashboard')
    }else if(!signed) {
      router.replace('/login')
    }

  }, [signed, loading, router])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
})