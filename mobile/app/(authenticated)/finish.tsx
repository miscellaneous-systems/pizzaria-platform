import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { useState } from "react";
import api from "@/services/api";
import { useHeaderHeight } from '@react-navigation/elements';

type PaymentMethod = "MONEY" | "PIX" | "CARD";

const PAYMENT_OPTIONS = [
    { label: "Dinheiro", value: "MONEY" as PaymentMethod },
    { label: "PIX", value: "PIX" as PaymentMethod },
    { label: "Cartão", value: "CARD" as PaymentMethod },
];

export default function Finish() {

    const router = useRouter();
    const { table, order_id } = useLocalSearchParams<{ table: string; order_id: string }>();
    const headerHeight = useHeaderHeight();
    const [costumerName, setCostumerName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MONEY");
    const [tip, setTip] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSendOrder() {
        try {
            setLoading(true);

            const normalizedOrderId = Array.isArray(order_id) ? order_id[0] : order_id;
            if (!normalizedOrderId) {
                Alert.alert("Erro", "Pedido inválido. Volte e tente novamente.");
                return;
            }

            const normalizedName = costumerName.trim() || "Sem nome";
            const tipReais = Math.max(0, Number(tip.replace(",", ".")) || 0);
            const tipCentavos = Math.round(tipReais * 100);

            await api.put("/order/send", {
                order_id: normalizedOrderId,
                name: normalizedName,
                paymentMethod,
                tip: tipCentavos,
            });

            Alert.alert("Pedido enviado para a cozinha com sucesso!");

            router.dismissAll();
            router.replace("/(authenticated)/dashboard");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível enviar o pedido. Tente novamente.");
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
                            Enviar pedido para a cozinha?
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

                    <Select
                        label="Forma de pagamento"
                        placeholder="Selecione a forma de pagamento..."
                        options={PAYMENT_OPTIONS}
                        selectedValue={paymentMethod}
                        onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                    />

                    <View style={styles.tipRow}>
                        <Text style={styles.tipLabel}>Gorjeta (R$)</Text>
                        <Input
                            placeholder="0"
                            placeholderTextColor={colors.gray}
                            value={tip}
                            onChangeText={setTip}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <Button loading={loading} title="Enviar para cozinha" onPress={handleSendOrder} variant="primary" />
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
    tipRow: {
        width: '100%',
        gap: spacing.sm,
    },
    tipLabel: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: '600',
    },
});