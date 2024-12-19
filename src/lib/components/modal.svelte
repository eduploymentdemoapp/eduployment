<script>
    export let isOpen = false;
    export let title = "Modal Title";

    const closeModal = () => {
        isOpen = false;
    };
</script>

{#if isOpen}
<div class="modal fade show" tabindex="-1" style="display: block;" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{title}</h5>
                <button type="button" class="btn-close" aria-label="Close" on:click={closeModal}></button>
            </div>
            <div class="modal-body">
                <slot></slot>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .modal {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1050;
    }
</style>
