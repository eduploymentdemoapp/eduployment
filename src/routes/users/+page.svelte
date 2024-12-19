<script lang="ts">
    import { onMount } from 'svelte';
    import Modal from '$lib/components/modal.svelte';
    import type { ActionData } from '../$types.js';
    import jQuery  from 'jquery';
    import { applyAction, enhance } from "$app/forms";
    import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
    import 'datatables.net-bs5';
    import { writable, derived } from 'svelte/store';
  import { goto, invalidate, invalidateAll } from '$app/navigation';

	export let data;
    export let form: ActionData;
    
    let isModalOpen = false;

    const email = writable('');
    const firstName = writable('');
    const middleName = writable('');
    const lastName = writable('');
    const phoneNumber = writable('');
    const fromDuration = writable('');
    const upToDuration = writable('');

    const emailError = derived(email, ($email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return $email && !regex.test($email) ? 'Invalid email format' : null;
    });
    const firstNameError = derived(firstName, ($firstName) => {
        return $firstName && !/^[A-Z][a-z]*$/.test($firstName) ? 'First name must start with an uppercase letter' : null;
    });

    const middleNameError = derived(middleName, ($middleName) => {
        return $middleName && !/^[a-z]*$/.test($middleName) ? 'Middle name must only contain lowercase letters' : null;
    });

    const lastNameError = derived(lastName, ($lastName) => {
        return $lastName && !/^[A-Z][a-z]*$/.test($lastName) ? 'Last name must start with an uppercase letter' : null;
    });

    const phoneNumberError = derived(phoneNumber, ($phoneNumber) => {
        const regex = /^\+[1-9]\d{1,14}$/; 
        return $phoneNumber && !regex.test($phoneNumber) ? 'Invalid phone number format' : null;
    });
    const fromDurationError = derived(fromDuration, ($fromDuration) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; 
        return $fromDuration && !regex.test($fromDuration) ? 'Invalid date format (YYYY-MM-DD)' : null;
    });

    const upToDurationError = derived(upToDuration, ($upToDuration) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return $upToDuration && !regex.test($upToDuration) ? 'Invalid date format (YYYY-MM-DD)' : null;
    });    

    const openModal = () => {
        $email = '';
        $firstName = '';
        $middleName = '';
        $lastName = ''; 
        $phoneNumber = ''; 
        $fromDuration = '';
        $upToDuration = '';          
        isModalOpen = true;
    };

    const closeModal = () => {
        isModalOpen = false;
    };   

    onMount(() => {
        jQuery('#datatables-reponsive').DataTable({
            responsive: true
        });
    });

</script>

<div class="header">
    <h1 class="header-title">
        Users
    </h1>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Users</li>
        </ol>
    </nav>
</div>
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#centeredModalPrimary" on:click={openModal}>
                    Add User
                </button>
            </div>
            <div class="card-body">
                <table id="datatables-reponsive" class="table table-striped" style="width:100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>E-mail</th>
                            <th>Phone</th>
                            <th>From</th>
                            <th>Up to</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.users as user}
                            <tr>
                                <td>{user.firstName} {user.middleName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.durationFromDate}</td>
                                <td>{user.durationUpDate}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<Modal bind:isOpen={isModalOpen} title="Add/Edit User">
    <form method="POST" use:enhance={({ formElement, formData, action, cancel }) => {
                return async ({ result }) => {
                    console.log('result', result);
                    if (result.type === 'success') {
                        isModalOpen = false;
                        goto('/users', { replaceState: true });
                        await invalidateAll();
                    } else {
                        await applyAction(result);
                    }
                };
            }}
        >
        <div class="mb-3">
            <label for="form-user.firstName" class="form-label">First name</label>
            <input id="form-user.firstName" type="text" name="firstName" bind:value={$firstName} class="form-control"  placeholder="Enter user first name">
            {#if $firstNameError}<span class="error">{$firstNameError}</span>{/if}
        </div>
        <div class="mb-3">
            <label for="form-user.middleName" class="form-label">Middle name</label>
            <input id="form-user.middleName"  type="text" name="middleName" bind:value={$middleName} class="form-control" placeholder="Enter user last Name">
            {#if $middleNameError}<span class="error">{$middleNameError}</span>{/if}
        </div>        
        <div class="mb-3">
            <label for="form-user.lastName" class="form-label">Last name</label>
            <input id="form-user.lastName"  type="text" name="lastName" bind:value={$lastName} class="form-control" required placeholder="Enter user last Name">
            {#if $lastNameError}<span class="error">{$lastNameError}</span>{/if}
        </div>
        <div class="mb-3">
            <label for="form-user.email" class="form-label">Email address</label>
            <input id="form-user.email"  type="email" name="email" bind:value={$email} class="form-control" required placeholder="user@provider.com">
            {#if $emailError}<span class="error">{$emailError}</span>{/if}
        </div>
        <div class="mb-3">
            <label for="form-user.phoneNumber" class="form-label">Phone number</label>
            <input id="form-user.phoneNumber"  type="tel" name="phoneNumber" bind:value={$phoneNumber} required class="form-control" placeholder="+597XXXXXXX">
            {#if $phoneNumberError}<span class="error">{$phoneNumberError}</span>{/if}
        </div>

        <div class="mb-3 col-md-6">
            <label for="form-user.fromDuration">Duration From</label>
            <div class="input-group date" data-target-input="nearest">
                <input type="text" id="form-user.fromDuration" name="fromDuration" bind:value={$fromDuration} required class="form-control" />
            </div>
            {#if $fromDurationError}
                <span class="error">{$fromDurationError}</span>
            {/if}
        </div>  
        <div class="mb-3 col-md-6">
            <label for="form-user.UpToDuration">Duration Up To</label>
            <div class="input-group date" data-target-input="nearest">
                <input type="text" id="form-user.UpToDuration" name="UpToDuration" bind:value={$upToDuration} required class="form-control" />
            </div>
            {#if $upToDurationError}
                <span class="error">{$upToDurationError}</span>
            {/if}            
        </div>        
        <p class="error">{form?.message ?? ""}</p>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" on:click={closeModal}>Close</button>
            <button type="submit" class="btn btn-primary" >Save</button>
        </div>
    </form>
</Modal>

<style>
    .error{
        color: red;
    }
</style>