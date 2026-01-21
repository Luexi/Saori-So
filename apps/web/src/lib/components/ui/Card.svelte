<script lang="ts">
	/**
	 * Componente Card - Tarjeta reutilizable
	 *
	 * Props:
	 * - hover: boolean - si debe tener efecto hover (default: false)
	 * - padding: 'sm' | 'md' | 'lg' (default: 'md')
	 */

	interface Props {
		hover?: boolean;
		padding?: 'sm' | 'md' | 'lg';
		children?: any;
	}

	let { hover = false, padding = 'md', children }: Props = $props();

	// Clases base de la card
	const baseClasses =
		'bg-surface-light dark:bg-surface-dark rounded-xl shadow-floating border border-gray-100 dark:border-gray-800';

	// Efecto hover
	const hoverClasses = hover ? 'hover:-translate-y-1 transition-transform duration-300' : '';

	// Padding
	const paddingClasses = {
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	// Combinar todas las clases
	const cardClasses = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]}`;
</script>

<div class={cardClasses}>
	{@render children?.()}
</div>
