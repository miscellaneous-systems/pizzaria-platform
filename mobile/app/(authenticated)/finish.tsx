import { Input } from "@/components/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { useState } from "react";
import api from "@/services/api";
import { useHeaderHeight } from '@react-navigation/elements';

export default function Finish() {

    const router = useRouter();
    const { table, order_id } = useLocalSearchParams<{ table: string; order_id: string }>();
    const headerHeight = useHeaderHeight();
    const [costumerName, setCostumerName] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleFinishOrder() {
        try {
            setLoading(true);

            const response = await api.put("/order/send", {
                order_id: order_id,
                name: costumerName ?? "Sem nome",
            });

            Alert.alert("Pedido enviado para a cozinha com sucesso!");

            router.dismissAll();
            router.replace("/(authenticated)/dashboard");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: headerHeight + 60 }]}
            >
                <View style={styles.content}>
                    <View>
                        <Text style={styles.text}>
                            Você deseja finalizar o pedido?
                        </Text>
                        <Text style={styles.table}>
                            Mesa {table}
                        </Text>
                    </View>

                    <Input
                    placeholder="Nome do cliente..."
                    placeholderTextColor={colors.gray}
                    value={costumerName}
                    onChangeText={setCostumerName}
                    />

                    <Button loading={loading} title="Finalizar" onPress={handleFinishOrder} variant="primary" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: spacing.xl,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.lg,
    },
    text: {
        color: colors.primary,
        fontSize: fontSize.xl,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    table: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});