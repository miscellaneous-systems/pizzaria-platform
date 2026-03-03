import { Item } from '@/types';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '@/constants/theme';
import { formatPrice } from '@/utils/format';

interface ItemProps {
    item: Item;
    onRemove: (item_id: string) => Promise<void>;
}

export function OrderItem({ item, onRemove }: ItemProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.productName}>{item.product?.name}</Text>
                <Text style={styles.productDetail}>{item.amount} x - R$ {formatPrice(item.product?.price * item.amount)}</Text>
            </View>
            <Pressable style={styles.deleteButton} onPress={() => onRemove(item.id)}>
                <Feather name="trash" size={20} color={colors.primary} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundInput,
        borderRadius: 8,
        padding: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    content: {
        flex: 1,
    },
    productName: {
        color: colors.primary,
        fontSize: fontSize.md,
        marginBottom: 4
    },
    productDetail: {
        color: colors.gray,
    },
    deleteButton: {
        backgroundColor: colors.red,
        padding: 8,
        borderRadius: 4,
    }
})