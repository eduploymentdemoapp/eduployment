<script>
	import { onMount } from 'svelte';
    import { page } from '$app/stores'; 
    import '../styles/css/modern.css';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import TopNavigation from '$lib/components/topNavigation.svelte';
    import SideNavigation from '$lib/components/sideNavigation.svelte';
    import Footer from '$lib/components/footer.svelte';

    let currentRoute;
    $: currentRoute = $page.url.pathname;

    onMount(async () => {
		await import('../styles/js/app.js');
		await import('../styles/js/settings.js');
	});	    
</script>

{#if    currentRoute !== '/login'
    &&  currentRoute !== '/2fa'
    &&  currentRoute !== '/2fa/setup'
    &&  currentRoute !== '/set-password'
}
<div class="wrapper">
    <SideNavigation />

    <div class="main">
		<TopNavigation />

		<main class="content">
            <div class="container-fluid">
				<slot></slot>
            </div>			
		</main>
		
		<Footer />
	</div>
</div>
{:else}
    <slot />
{/if}

<style>
    :global(.sidebar-brand) {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    :global(.logo) {
        height: 40px;
        width: auto;
    }

    :global(.logo-text) {
        font-size: 1.25rem;
        font-weight: bold;
    }
</style>