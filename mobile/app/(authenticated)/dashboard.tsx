import { useAuth } from '@/contexts/AuthContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors, fontSize, spacing, borderRadius } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '@/services/api';
import { Order } from '@/types';
import { useRouter } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';

export default function Dashboard() {

  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const headerHeight = useHeaderHeight();
  
  async function handleOpenTable() {
    if(!tableNumber) {
      alert('Erro: Informe o número da mesa');
      return;
    }
    
    const table = parseInt(tableNumber);

    if(isNaN(table) || table <= 0) {
      alert('Erro: Informe um número válido');
      return;
    }

    try{
      setLoading(true);

      const response = await api.post<Order>('/order', {
        table: table,
      });

      console.log(response.data);

      router.push({
        pathname: "/(authenticated)/order",
        params: {
          table: response.data.table.toString(), order_id: response.data.id,
        },
      });

      setTableNumber('');
    }catch(error){
      alert('Erro: Falha ao abrir mesa, tente novamente mais tarde');
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <TouchableOpacity style={styles.signoutButton} onPress={signOut}>
              <Text style={styles.signoutText}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.contentContainer, { paddingBottom: headerHeight + 100 }]}>

            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                Pizza<Text style={styles.logoBrand}>Hub</Text>
              </Text>
            </View>

            <Text style={styles.title}>Novo pedido</Text>
            <Input 
            placeholder="Numero da mesa"
            style={styles.input}
            placeholderTextColor={colors.gray}
            value={tableNumber}
            onChangeText={setTableNumber}
            keyboardType="numeric"
            ></Input>

            <Button title="Abrir mesa" onPress={handleOpenTable} />

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  signoutButton: {
    backgroundColor: colors.red,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  signoutText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoBrand: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.brand,
  },
  title: {
    fontSize: fontSize.xl,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
});