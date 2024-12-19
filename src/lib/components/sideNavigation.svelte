<script lang="ts">
	import { page } from '$app/stores';
	import logo from '../../assests/logo_square_light.svg';

</script>

<nav id="sidebar" class="sidebar">
    <a class="sidebar-brand" href="/">
        <img class="logo" src={logo} alt="Eduployment Logo">
        <span class="logo-text">Eduployment</span>
    </a>
    <div class="sidebar-content">
        <ul class="sidebar-nav">
            <li class="sidebar-item" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
                <a href="/" class="sidebar-link">
                    <i class="align-middle me-2 fas fa-fw fa-home"></i>
                    <span class="align-middle">Dashboards</span>
                </a>
            </li> 
            <li class="sidebar-item" aria-current={$page.url.pathname === '/users' ? 'page' : undefined}>
                <a href="/users" class="sidebar-link">
                    <i class="align-middle me-2 fas fa-fw fa-users"></i>
                    <span class="align-middle">Users</span>
                </a>
            </li>
        </ul>
    </div>
</nav>