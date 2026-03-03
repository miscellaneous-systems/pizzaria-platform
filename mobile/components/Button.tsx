import { colors, borderRadius, spacing, fontSize } from '@/constants/theme';
import { TouchableOpacity, Text, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native'



interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
    loading?: boolean;
}

export function Button({ 
    title,
    variant = 'primary',
    loading = false,
    disabled,
    style,
    ...rest 
}: ButtonProps) {


    const backgroundColor = variant === 'primary' ? colors.green : colors.brand;

    return (
        <TouchableOpacity 
        style={[
            styles.button,
            { backgroundColor },
            (disabled || loading) && styles.buttonDisabled,
            style,
        ]}
        {...rest}
        >
            {loading ? <ActivityIndicator color={colors.background} /> 
            : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: colors.background,
        fontSize: fontSize.lg,
        fontWeight: '600',
    },
})