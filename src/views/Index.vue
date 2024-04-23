<template>


    <div class="card">

        <Toolbar class="mb-4">

            <template #start>
                <Button label="Novo Colaborador" icon="pi pi-plus" severity="success" class="mr-2" @click="novoColaborador" />
                <Button label="Remover" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!colaboradoresSelecionados || !colaboradoresSelecionados.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Importar" class="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
            </template>

        </Toolbar>

        <DataTable
            ref="dt"
            :value="colaboradores"
            v-model:selection="colaboradoresSelecionados"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Exibindo de {first} à {last} de {totalRecords} colaboradores">

            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h4 class="m-0">Gerenciamento de Colaboradores</h4>
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search" />
                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

            <Column field="id" header="ID" sortable style="min-width:12rem"></Column>

            <Column field="nome" header="nome" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">nome</span>
                    {{ slotProps.nome }}
                </template>
            </Column>

            <Column field="nome" header="Nome" sortable style="min-width:16rem"></Column>

            <Column field="telefone" header="Telefone" sortable style="min-width:16rem"></Column>

            <Column field="pix.tipo" header="Chave Pix" sortable style="min-width:16rem">
                <template #body="slotProps">
                    <label for="pix-chave">{{ slotProps.data.pix.tipo.description }}</label>
                    <p id="pix-chave">{{slotProps.data.pix.chave}}</p>
                </template>
            </Column>

            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editarColaborador(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteColaborador(slotProps.data)" />
                </template>
            </Column>

        </DataTable>

    </div>

    <Dialog v-model:visible="colaboradorDialog" :style="{width: '450px'}" header="Detalhes do Colaborador" :modal="true" class="p-fluid">

        <div class="field">
            <label for="nome">Nome</label>
            <InputText id="nome" v-model.trim="colaborador.nome" required="true" autofocus :invalid="submitted && !colaborador.nome" />
            <small class="p-error" v-if="submitted && !colaborador.nome">Nome é obrigatório.</small>
        </div>

        <div class="field">
            <label for="telefone" class="font-bold block mb-2">Telefone</label>
            <InputMask id="telefone" v-model="colaborador.telefone" required="true" mask="(99) 99999-9999" placeholder="(99) 99999-9999"
                autofocus :invalid="submitted && !colaborador.telefone" />
            <small class="p-error" v-if="submitted && !colaborador.nome">Telefone é obrigatório.</small>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Salvar" icon="pi pi-check" text @click="salvarColaborador" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteColaboradorDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="colaborador">Tem certeza que deseja remover <b>{{colaborador.nome}}</b>?</span>
        </div>

        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteColaboradorDialog = false"/>
            <Button label="Sim" icon="pi pi-check" text @click="deletarColaborador" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteColaboradoresDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="colaborador">Tem certeza que deseja remover os colaboradores selecionados?</span>
        </div>

        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteColaboradoresDialog = false"/>
            <Button label="Sim" icon="pi pi-check" text @click="deletarColaboradoresSelecionados" />
        </template>
    </Dialog>

</template>

<script setup>
    import { FilterMatchMode } from 'primevue/api';
    import { ref, onMounted, onBeforeMount } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { ColaboradorService } from '@/service/ColaboradorService';

    const toast = useToast();

    const colaboradorService = new ColaboradorService();

    const dt = ref();

    const colaboradores = ref();
    const colaboradorDialog = ref(false);
    const deleteColaboradorDialog = ref(false);
    const deleteColaboradoresDialog = ref(false);
    const colaborador = ref({});
    const colaboradoresSelecionados = ref();

    const filters = ref({});
    const submitted = ref(false);


    onBeforeMount(() => {
        initFilters();
    });


    onMounted(() => {
        colaboradorService.getColaboradores()
            .then((data) => (colaboradores.value = data))
            .catch((error) => (console.error('Erro ao obter colaboradores:', error)));
    });


    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
    };


    const novoColaborador = () => {
        colaborador.value = {};
        submitted.value = false;
        colaboradorDialog.value = true;
    };


    const hideDialog = () => {
        colaboradorDialog.value = false;
        submitted.value = false;
    };


    const salvarColaborador = () => {
        submitted.value = true;

        if (colaborador?.value.nome?.trim()) {
            if (colaborador.value.id) {
                colaboradores.value[findIndexById(colaborador.value.id)] = colaborador.value;
                toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Atualizado', life: 3000});
            }
            else {
                colaboradores.value.push(colaborador.value);
                toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Cadastrado', life: 3000});
            }

            colaboradorDialog.value = false;
            colaborador.value = {};
        }
    };


    const editarColaborador = (colaboradorSelecionado) => {
        colaborador.value = {...colaboradorSelecionado};
        colaboradorDialog.value = true;
    };


    const confirmDeleteColaborador = (colaboradorSelecionado) => {
        colaborador.value = colaboradorSelecionado;
        deleteColaboradorDialog.value = true;
    };


    const deletarColaborador = () => {
        colaboradores.value = colaboradores.value.filter(val => val.id !== colaborador.value.id);
        deleteColaboradorDialog.value = false;
        colaborador.value = {};
        toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Removido', life: 3000});
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < colaboradores.value.length; i++) {
            if (colaboradores.value[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const exportCSV = () => {
        dt.value.exportCSV();
    };


    const confirmDeleteSelected = () => {
        deleteColaboradoresDialog.value = true;
    };


    const deletarColaboradoresSelecionados = () => {
        colaboradores.value = colaboradores.value.filter(val => !colaboradoresSelecionados.value.includes(val));
        deleteColaboradoresDialog.value = false;
        colaboradoresSelecionados.value = null;
        toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaboradores Removidos', life: 3000});
    };

</script>
