<script lang="ts">
	import { enhance } from "$app/forms";
    import logo from '../../../assests/200724-Logo-Eduployment-DEF_Logo_Logo-1.svg';  

	import type { ActionData, PageData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<main class="main h-100 w-100">
    <div class="container h-100">
        <div class="row h-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">
                    <div class="text-center mt-4">
                        <h1 class="h2">Set up two-factor authentication</h1>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="text-center">
                                <img src={logo} alt="Logo" class="img-fluid" width="200" height="200"  />
                            </div>                                
                            <div class="m-sm-4">
                                <form method="post" use:enhance>
                                    <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                                        <div style="width: 200px; height: 200px;">
                                            {@html data.qrcode}
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <p>Please scan this QR code with an authenticator application like google authenticator</p>
                                    </div>                                       
									<div class="mb-3">
                                        <input name="key" value={data.encodedTOTPKey} hidden required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="form-totp.code">Code</label>
                                        <input id="form-totp.code" class="form-control form-control-lg" name="code" required placeholder="Enter your 2FA code" />
                                    </div>
									<p class="error">{form?.message ?? ""}</p>
                                    <div class="text-center mt-3">
                                        <button type="submit" class="btn btn-lg btn-primary">Verify</button>
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