<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	// Links de navegación
	const navLinks = [
		{ name: 'Dashboard', icon: 'dashboard', href: '/', active: true },
		{ name: 'POS', icon: 'point_of_sale', href: '/pos', active: false },
		{ name: 'Inventario', icon: 'inventory_2', href: '/inventory', active: false },
		{ name: 'Clientes', icon: 'groups', href: '/customers', active: false },
		{ name: 'Reportes', icon: 'description', href: '/reports', active: false },
		{ name: 'Configuración', icon: 'settings', href: '/settings', active: false }
	];

	// Usuario actual (temporal - luego vendrá del store de auth)
	const currentUser = {
		name: 'Admin',
		role: 'Administrador',
		avatar: 'https://ui-avatars.com/api/?name=Admin&background=295570&color=fff'
	};
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
	<!-- Sidebar -->
	<aside
		class="flex w-[80px] lg:w-[260px] flex-col border-r border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark transition-all duration-300"
	>
		<!-- Logo -->
		<div
			class="flex h-20 items-center justify-center lg:justify-start px-0 lg:px-6 border-b border-gray-100 dark:border-gray-800/50"
		>
			<div class="flex items-center gap-3">
				<div
					class="size-8 rounded-lg bg-primary flex items-center justify-center text-white"
				>
					<span class="material-symbols-outlined text-[20px]">grid_view</span>
				</div>
				<span
					class="text-xl font-bold tracking-tight text-primary dark:text-white hidden lg:block"
					>Saori<span class="font-light opacity-70">SO</span></span
				>
			</div>
		</div>

		<!-- Navigation -->
		<div class="flex flex-1 flex-col justify-between py-6 px-3">
			<nav class="flex flex-col gap-2">
				{#each navLinks as link}
					<a
						href={link.href}
						class="group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors {link.active
							? 'bg-primary/10 text-primary dark:text-white'
							: 'text-text-secondary-light hover:bg-gray-100 dark:text-text-secondary-dark dark:hover:bg-gray-800'}"
					>
						<span class="material-symbols-outlined {link.active ? 'filled' : ''}"
							>{link.icon}</span
						>
						<span class="text-sm font-medium hidden lg:block">{link.name}</span>
					</a>
				{/each}
			</nav>

			<!-- User Profile -->
			<div
				class="flex items-center gap-3 px-1 lg:px-2 pt-4 border-t border-gray-100 dark:border-gray-800"
			>
				<div
					class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 shrink-0 ring-2 ring-white dark:ring-gray-700"
					style="background-image: url('{currentUser.avatar}');"
				></div>
				<div class="flex flex-col overflow-hidden hidden lg:flex">
					<h1 class="text-sm font-semibold truncate text-text-primary-light dark:text-white">
						{currentUser.name}
					</h1>
					<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
						{currentUser.role}
					</p>
				</div>
				<button
					class="ml-auto text-text-secondary-light hover:text-primary dark:text-text-secondary-dark dark:hover:text-white hidden lg:block"
				>
					<span class="material-symbols-outlined text-[20px]">logout</span>
				</button>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col h-full overflow-hidden relative">
		{@render children()}
	</main>
</div>
