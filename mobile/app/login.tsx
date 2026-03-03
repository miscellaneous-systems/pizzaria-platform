import { colors, spacing, fontSize } from '@/constants/theme'
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TextInput,
    Platform,
    Alert,
} from 'react-native'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'


export default function Login() {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn } = useAuth();
    const router = useRouter();


    async function handleLogin() {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Atenção', 'Email e senha são obrigatórios')
            return
        }
        try {
            setLoading(true)
            await signIn(email, password)

            router.replace('/(authenticated)/dashboard')
        } catch (error) {
            Alert.alert('Erro', 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }


    return (
        <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
             <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>
                        Pizza<Text style={styles.logoBrand}>Hub</Text>
                    </Text>
                    <Text style={styles.logoSubtitle}>Garçom App</Text>
                </View>

                <View style={styles.formContainer}>
                    <Input label="Email" 
                    placeholder="Digite seu email..."
                    placeholderTextColor={colors.gray}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />

                    <Input label="Senha" 
                    placeholder="Digite sua senha..."
                    placeholderTextColor={colors.gray}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    keyboardType="visible-password"
                    />
                </View>
                <Button title="Acessar" variant="primary" loading={loading} onPress={handleLogin} style={{ marginTop: spacing.xl }} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
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
    logoSubtitle: {
        fontSize: fontSize.md,
        color: colors.primary,
    },
    formContainer: {
        gap: spacing.md,
    },
});