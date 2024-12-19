<script lang="ts">
    import { enhance } from "$app/forms";
</script>

<nav class="navbar navbar-expand navbar-theme">
    <!-- <a class="sidebar-toggle d-flex me-2">
        <i class="hamburger align-self-center"></i>
    </a> -->

    <!-- <form class="d-none d-sm-inline-block">
        <input class="form-control form-control-lite" type="text" placeholder="Search projects...">
    </form> -->

    <div class="navbar-collapse collapse">
        <ul class="navbar-nav ms-auto">
            <!-- Messages -->
            <!-- <li class="nav-item dropdown active">
                <a class="nav-link dropdown-toggle position-relative" href="#" id="messagesDropdown" data-bs-toggle="dropdown">
                    <i class="align-middle fas fa-envelope-open"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="messagesDropdown">
                    <div class="dropdown-menu-header">
                        <div class="position-relative">
                            0 New Messages
                        </div>
                    </div>
                    <div class="dropdown-menu-footer">
                        <a href="#" class="text-muted">Show all messages</a>
                    </div>
                </div>
            </li> -->
            <!-- Notifications -->
            <!-- <li class="nav-item dropdown ms-lg-2">
                <a class="nav-link dropdown-toggle position-relative" href="#" id="alertsDropdown" data-bs-toggle="dropdown">
                    <i class="align-middle fas fa-bell"></i>
                    <span class="indicator"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="alertsDropdown">
                    <div class="dropdown-menu-header">
                        0 New Notifications
                    </div>
                    <div class="dropdown-menu-footer">
                        <a href="#" class="text-muted">Show all notifications</a>
                    </div>
                </div>                        
            </li> -->
            <!-- Settings -->
            <li class="nav-item dropdown ms-lg-2">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <a class="nav-link dropdown-toggle position-relative" id="userDropdown" data-bs-toggle="dropdown">
                    <i class="align-middle fas fa-cog"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <!-- <a class="dropdown-item" href="#"><i class="align-middle me-1 fas fa-fw fa-user"></i> View Profile</a> -->
                    <!-- <a class="dropdown-item" href="#"><i class="align-middle me-1 fas fa-fw fa-comments"></i> Contacts</a> -->
                    <!-- <a class="dropdown-item" href="#"><i class="align-middle me-1 fas fa-fw fa-chart-pie"></i> Analytics</a> -->
                    <!-- <a class="dropdown-item" href="#"><i class="align-middle me-1 fas fa-fw fa-cogs"></i> Settings</a> -->
                    <!-- <div class="dropdown-divider"></div> -->
                    <a class="dropdown-item" href="/logout"><i class="align-middle me-1 fas fa-fw fa-arrow-alt-circle-right"></i> Sign out</a>
            </li>                    
        </ul>
    </div>
</nav>