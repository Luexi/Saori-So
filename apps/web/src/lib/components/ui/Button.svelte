<script lang="ts">
	/**
	 * Componente Button - Botón reutilizable
	 *
	 * Props:
	 * - variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
	 * - size: 'sm' | 'md' | 'lg' (default: 'md')
	 * - type: 'button' | 'submit' | 'reset' (default: 'button')
	 * - disabled: boolean (default: false)
	 * - onclick: función de click
	 */

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: () => void;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	// Clases base del botón
	const baseClasses =
		'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	// Variantes de estilo
	const variantClasses = {
		primary:
			'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:ring-primary',
		secondary:
			'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-primary-light dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary',
		ghost:
			'text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-gray-800 focus:ring-primary'
	};

	// Tamaños
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	// Combinar todas las clases
	const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

<button class={buttonClasses} {type} {disabled} {onclick}>
	{@render children?.()}
</button>
