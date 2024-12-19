<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { ActionData } from "../$types";
  import logo from '../../assests/200724-Logo-Eduployment-DEF_Logo_Logo-1.svg';  

  let email = "";
  export let form: ActionData;

  function getQueryParam(param: string) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  onMount(() => {
    email = getQueryParam("email") || "";
  });

</script>

<main class="main h-100 w-100">
    <div class="container h-100">
        <div class="row h-100">
            <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                <div class="d-table-cell align-middle">
                    <div class="text-center mt-4">
                        <h2 class="h2">Reset your password</h2>
                        <p class="lead">
                            for <strong class="text-dark">{email}</strong>
                        </p>
                    </div>
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="text-center">
                                <img src={logo} alt="Logo" class="img-fluid" width="200" height="200"  />
                            </div>                            
                            <div class="m-sm-4">
                                <form method="post" use:enhance>
                                    <input id="form-set-password.email" type="hidden" name="email" value="{email}" />
                                    <div class="mb-3">
                                        <label for="form-set-password.password" class="form-label">New password</label>
                                        <div class="input-group">
                                            <input 
                                                id="form-set-password.password"
                                                class="form-control form-control-lg" 
                                                type="password" 
                                                name="password" 
                                                placeholder="Enter your new password" 
                                            />
                                        </div>
                                    </div>                                    
                                    <p class="error">{form?.message ?? ""}</p>
                                    <div class="text-center mt-4">
                                        <button  class="btn btn-primary btn-lg px-4">
                                            Save
                                        </button>
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