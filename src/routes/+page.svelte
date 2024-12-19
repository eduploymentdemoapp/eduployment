<script lang="ts">
    import { enhance } from "$app/forms";

    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="header">
    <h1 class="header-title">
        Dashboard
    </h1>
    <nav aria-label="breadcrumb">
        <!-- <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
        </ol> -->
    </nav>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Welcome to the Eduployment</h2>
            </div>
            <div class="card-body">
                <p>
                    This is an demo application.
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .card-title {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .card-body p {
        margin-bottom: 1rem;
        line-height: 1.6;
    }
</style>
