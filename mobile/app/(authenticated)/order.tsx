import { View, Text, ActivityIndicator, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Category, Product, Item } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/Button';
import { colors, fontSize, spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuantityControl } from '@/components/QuantityControl';
import { Select } from '@/components/Select';
import { OrderItem } from '@/components/Item';

export default function Order() {

    const router = useRouter();
    const { table, order_id } = useLocalSearchParams<{ table: string; order_id: string }>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingAddItem, setLoadingAddItem] = useState(false);

    const [items, setItems] = useState<Item[]>([]);

    const insets = useSafeAreaInsets();






    useEffect(() => {
        async function loadDataCategories() {
            await loadCategories();
        }
        loadDataCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadProducts(selectedCategory);
        } else {
            setProducts([]);
            setSelectedCategory("");
        }
    }, [selectedCategory]);

    async function loadCategories() {
        try {

            const response = await api.get<Category[]>('/category');
            setCategories(response.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingCategories(false);
        }
    }

    async function loadProducts(category_id: string) {
        try {
            setLoadingProducts(true);

            const response = await api.get<Product[]>("/category/product",
                {
                    params: {
                        category_id: category_id,
                    }
                });
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProducts(false);
        }
    }

    async function handleRemoveItem(item_id: string) {
        try {
            const response = await api.delete<Item>("/order/remove", {
                params: {
                    item_id: item_id,
                },
            });

            const updatedItems = items.filter(item => item.id !== item_id);
            setItems(updatedItems);

            Alert.alert("Item removido!", "Seu item foi removido com sucesso");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro ao remover item", "Ocorreu um erro ao remover o item");
        }
    }

    async function handleAddItem() {
        try {

            const response = await api.post<Item>('/order/add', {
                order_id: order_id,
                product_id: selectedProduct,
                amount: quantity,
            });

            setItems([...items, response.data]);
            setQuantity(1);
            setSelectedProduct("");

        } catch (error) {
            console.log(error);
        } finally {
            setLoadingAddItem(false);
        }
    }

    async function handleAdvance() {
        if (items.length === 0) {
            Alert.alert("Erro ao avançar", "Você precisa adicionar pelo menos um item ao pedido");
            return;
        }

        router.push({
            pathname: "/(authenticated)/finish",
            params: {
                order_id: order_id,
                table: table,
            }
        });
    }

    if (loadingCategories) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Mesa: {table}</Text>

                    <Pressable style={styles.closeButton} onPress={() => router.back()}>
                        <Ionicons name="trash" size={20} color={colors.primary} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >

                <Select
                    label="Categorias"
                    placeholder="Selecione a categoria..."
                    options={categories.map(category => ({
                        label: category.name,
                        value: category.id,
                    }))}
                    selectedValue={selectedCategory}
                    onValueChange={setSelectedCategory}
                />

                {loadingProducts ? (
                    <ActivityIndicator size="small" color={colors.brand} />
                ) : (
                    selectedCategory && <Select placeholder="Selecione o produto..." options={products.map(product => ({
                        label: product.name,
                        value: product.id,
                    }))}
                        selectedValue={selectedProduct}
                        onValueChange={setSelectedProduct}
                    />
                )}

                {selectedProduct && (
                    <View style={styles.quantitySection}>
                        <Text style={styles.quantityLabel}>Quantidade</Text>
                        <QuantityControl quantity={quantity}
                            onIncrement={() => setQuantity(quantity => quantity + 1)}
                            onDecrement={() => {
                                if (quantity <= 1) {
                                    setQuantity(1);
                                    return;
                                }

                                setQuantity(quantity => quantity - 1);
                            }
                            }
                        />
                    </View>
                )}

                {selectedProduct && (
                    <Button title="Adicionar" onPress={handleAddItem} variant="secondary">
                    </Button>
                )}

                {items.length > 0 && (
                    <View style={styles.itemsSection}>
                        <Text style={styles.itemsTitle}>Itens adicionados</Text>
                        {items.map((item) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </View>
                )}

                {items.length > 0 && (
                    <View style={styles.footer}>
                        <Button title="Avançar" onPress={handleAdvance} variant="primary" />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontSize.xl,
        color: colors.primary,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: colors.red,
        padding: spacing.sm,
        borderRadius: 8,
    },
    scrollContent: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        gap: 14,
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    quantityLabel: {
        color: colors.primary,
        fontSize: fontSize.lg,
        fontWeight: 'bold',
    },
    itemsSection: {
        marginTop: spacing.xl,
        gap: spacing.md,
    },
    itemsTitle: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: fontSize.lg,
    },
    footer: {
        paddingTop: 24,

    }
});

