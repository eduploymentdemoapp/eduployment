<script lang="ts">
	import { enhance } from "$app/forms";
    import logo from '../../assests/200724-Logo-Eduployment-DEF_Logo_Logo-1.svg'; 

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<main class="main h-100 w-100">
    <div class="container h-100">
        <div class="row h-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">
                    <div class="text-center mt-4">
                        <h1 class="h2">Two-factor authentication</h1>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="text-center">
                                <img src={logo} alt="Logo" class="img-fluid" width="200" height="200"  />
                            </div>                               
                            <div class="m-sm-4">
                                <form method="post" use:enhance>
                                    <div class="mb-3">
                                        <label for="form-totp.code">Code</label>
                                        <input id="form-totp.code" class="form-control form-control-lg" name="code" autocomplete="one-time-code" placeholder="Enter your 2FA code" />
                                    </div>
									<p class="error">{form?.message ?? ""}</p>
                                    <div class="text-center mt-3">
                                        <button class="btn btn-lg btn-primary">Verify</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .error{
        color: red;
    }
</style>