<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	// Métricas del dashboard
	const metrics = [
		{
			title: 'Ventas del Día',
			value: '$12,450',
			change: '+12%',
			trend: 'up',
			icon: 'trending_up'
		},
		{
			title: 'Productos Vendidos',
			value: '145',
			change: '+5%',
			trend: 'up',
			icon: 'shopping_cart'
		},
		{
			title: 'Clientes Nuevos',
			value: '8',
			change: '0%',
			trend: 'neutral',
			icon: 'groups'
		},
		{
			title: 'Stock Bajo',
			value: '3',
			change: '-2',
			trend: 'warning',
			icon: 'warning'
		}
	];
</script>

<!-- Header -->
<header
	class="flex-none px-6 py-6 lg:px-10 border-b border-gray-100 dark:border-gray-800 bg-background-light dark:bg-background-dark z-10"
>
	<div
		class="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
	>
		<div class="flex flex-col gap-1">
			<h2
				class="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary-light dark:text-white"
			>
				Hola, Admin
			</h2>
			<p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
				Aquí está lo que está pasando con tu negocio hoy.
			</p>
		</div>
		<div class="flex items-center gap-3">
			<Button variant="secondary">
				<span class="material-symbols-outlined text-[18px]">calendar_today</span>
				<span>Hoy</span>
			</Button>
			<Button variant="primary">
				<span class="material-symbols-outlined text-[20px]">add</span>
			</Button>
		</div>
	</div>
</header>

<!-- Scrollable Content -->
<div class="flex-1 overflow-y-auto px-6 py-8 lg:px-10 scroll-smooth">
	<div class="max-w-[1600px] mx-auto flex flex-col gap-8">
		<!-- Metrics Row -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
			{#each metrics as metric}
				<Card hover={true}>
					<div class="flex justify-between items-start mb-4">
						<div>
							<p class="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
								{metric.title}
							</p>
							<h3 class="text-3xl font-bold text-text-primary-light dark:text-white mt-1">
								{metric.value}
							</h3>
						</div>
						<span
							class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold {metric.trend ===
							'up'
								? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
								: metric.trend === 'warning'
									? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500'
									: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}"
						>
							<span class="material-symbols-outlined text-[14px]">{metric.icon}</span>
							{metric.change}
						</span>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Placeholder for future content -->
		<Card>
			<div class="text-center py-12">
				<span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700"
					>construction</span
				>
				<h3 class="text-xl font-bold text-text-primary-light dark:text-white mt-4">
					Dashboard en Construcción
				</h3>
				<p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
					Pronto tendrás gráficas y más información aquí.
				</p>
			</div>
		</Card>
	</div>
</div>
