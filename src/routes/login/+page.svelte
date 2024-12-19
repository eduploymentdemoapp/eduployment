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
                        <h1 class="h2">Welcome back</h1>
                        <p class="lead">
                            Sign in to your account to continue
                        </p>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <div class="text-center">
                                <img src={logo} alt="Logo" class="img-fluid" width="200" height="200"  />
                            </div>
                            <div class="m-sm-4">
                                <form method="post" use:enhance>
                                    <div class="mb-3">
                                        <label for="form-login.email">Email</label>
                                        <input id="form-login.email" class="form-control form-control-lg" type="email" name="email" placeholder="Enter your email" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="form-login.password">Password</label>
                                        <input id="form-login.password" class="form-control form-control-lg" type="password" name="password" placeholder="Enter your password" />
                                        <small>
                                            <a href="/forgot-password">Forgot password?</a>
                                        </small>
                                    </div>
                                    <div>
                                        <div class="form-check align-items-center">
                                            <input id="customControlInline" type="checkbox" class="form-check-input" value="remember-me" name="remember-me"
                                                checked>
                                            <label class="form-check-label text-small" for="customControlInline">Remember me next time</label>
                                        </div>
                                    </div>
                                    <p>{form?.message ?? ""}</p>
                                    <div class="text-center mt-3">
                                        <button class="btn btn-lg btn-primary">Sign in</button>
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
