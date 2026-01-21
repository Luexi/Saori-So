<script lang="ts">
	/**
	 * Componente Input - Campo de entrada reutilizable
	 *
	 * Props:
	 * - type: tipo de input (default: 'text')
	 * - placeholder: texto placeholder
	 * - value: valor del input
	 * - label: etiqueta del input
	 * - error: mensaje de error
	 * - disabled: boolean (default: false)
	 * - required: boolean (default: false)
	 */

	interface Props {
		type?: string;
		placeholder?: string;
		value?: string;
		label?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
	}

	let {
		type = 'text',
		placeholder = '',
		value = $bindable(''),
		label = '',
		error = '',
		disabled = false,
		required = false,
		name = '',
		id = ''
	}: Props = $props();

	// Generar ID único si no se proporciona
	const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<label
			for={inputId}
			class="text-sm font-medium text-text-primary-light dark:text-white"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		{type}
		{placeholder}
		{disabled}
		{required}
		{name}
		id={inputId}
		bind:value
		class="px-4 py-2 text-sm rounded-lg border-0 bg-white dark:bg-surface-dark shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary transition-shadow disabled:opacity-50 disabled:cursor-not-allowed {error
			? 'ring-red-500 focus:ring-red-500'
			: ''}"
	/>

	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}
</div>
