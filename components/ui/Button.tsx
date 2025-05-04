import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({
  title,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...rest
}, ref) => {
  // Get button styles based on variant
  const getButtonStyles = (variant: ButtonVariant, disabled: boolean) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.inactive : colors.primary,
          borderColor: disabled ? colors.inactive : colors.primary,
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.inactive : colors.secondary,
          borderColor: disabled ? colors.inactive : colors.secondary,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? colors.inactive : colors.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? colors.inactive : colors.error,
          borderColor: disabled ? colors.inactive : colors.error,
          borderWidth: 1,
        };
      case 'success':
        return {
          backgroundColor: disabled ? colors.inactive : colors.success,
          borderColor: disabled ? colors.inactive : colors.success,
          borderWidth: 1,
        };
      case 'warning':
        return {
          backgroundColor: disabled ? colors.inactive : colors.warning,
          borderColor: disabled ? colors.inactive : colors.warning,
          borderWidth: 1,
        };
      default:
        return {
          backgroundColor: disabled ? colors.inactive : colors.primary,
          borderColor: disabled ? colors.inactive : colors.primary,
          borderWidth: 1,
        };
    }
  };

  // Get text color based on variant
  const getTextColor = (variant: ButtonVariant, disabled: boolean) => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return disabled ? colors.inactive : colors.primary;
      default:
        return disabled ? colors.textSecondary : colors.white;
    }
  };

  // Get button size styles
  const getSizeStyles = (size: ButtonSize) => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 4,
          fontSize: 14,
        };
      case 'md':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
          fontSize: 16,
        };
      case 'lg':
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 8,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 6,
          fontSize: 16,
        };
    }
  };

  const buttonStyles = getButtonStyles(variant, disabled);
  const textColor = getTextColor(variant, disabled);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        buttonStyles,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: sizeStyles.borderRadius,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize: sizeStyles.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});