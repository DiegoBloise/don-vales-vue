<style>
    .tipo-chave-button {
        width: 100px;
        height: 100px;
        transition: 0.2s;
    }

    .tipo-chave-button:hover {
        border-color: #3ba8fc !important;
        cursor: pointer;
    }

    .tipo-chave-button-selecionada {
        border-color: #3da9fc !important;
        background-color: #6bbfff2a !important;
        box-shadow: none !important;
    }

    .tipo-chave-button-selecionada:hover {
        box-shadow: none !important;
    }

    .pix-icon {
        border-color: #3da9fc !important;
        background-color: #6bbfff2a !important;
    }
</style>

<template>

    <div class="card">

        <!-- <h1>{{ colaborador }}</h1> -->

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
            v-model:expandedRows="expandedRows"
            @rowExpand="onRowExpand"
            @rowCollapse="onRowCollapse"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            removableSort
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
                    <div class="flex flex-wrap justify-content-end gap-2">
                        <Button text icon="pi pi-plus" label="Expandir Todos" @click="expandAll" />
                        <Button text icon="pi pi-minus" label="Fechar Todos" @click="collapseAll" />
                    </div>
                </div>
            </template>

            <Column expander style="width: 5rem" />

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

            <Column field="nome" header="Nome" sortable style="min-width:16rem"></Column>

            <Column field="telefone" header="Telefone" sortable style="min-width:16rem"></Column>

            <Column field="pix.tipo" header="Chave Pix" sortable style="min-width:16rem">
                <template #body="slotProps">
                    <label for="pix-chave">{{ slotProps.data.pix.tipo}}</label>
                    <p id="pix-chave">{{slotProps.data.pix.chave}}</p>
                </template>
            </Column>

            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-ticket" outlined rounded class="mr-2" @click="confirmImprimirVale(slotProps.data)" />
                    <Button icon="pi pi-pencil" outlined rounded severity="warning"class="mr-2" @click="editarColaborador(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteColaborador(slotProps.data)" />
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Vales de {{ slotProps.data.nome }}</h5>
                    <DataTable :value="slotProps.data.vales">
                        <Column field="data" header="Data" sortable></Column>

                        <Column field="valor" header="Valor" sortable>
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.valor) }}
                            </template>
                        </Column>

                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Total:" footerStyle="text-align:right" />
                                <Column :footer="totalValesColaborador(slotProps.data)" />
                            </Row>
                        </ColumnGroup>

                        <Column :exportable="false" style="min-width:8rem">
                            <template #body="slotProps">
                                <Button icon="pi pi-print" outlined rounded severity="help" class="mr-2" @click="confirmImprimirVale(slotProps.data)" />
                                <Button icon="pi pi-pencil" outlined rounded severity="warning" class="mr-2" @click="editarVale(slotProps.data)" />
                                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteVale(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>

        </DataTable>

    </div>

    <Dialog
        v-model:visible="colaboradorDialog"
        header="Detalhes do Colaborador"
        :modal="true"
        class="p-fluid max-w-min"
        :closable="false"
        :closeOnEscape="false"
        >

        <div class="flex flex-column">

            <div class="flex flex-row gap-3">

                <div class="flex flex-column flex-1">

                    <div class="field">
                        <label for="nome">Nome</label>
                        <InputText id="nome" v-model.trim="colaborador.nome" required="true" autofocus :invalid="submitted && !colaborador.nome" />
                        <small class="p-error" v-if="submitted && !colaborador.nome">Nome é obrigatório.</small>
                    </div>

                    <div class="field">
                        <label for="telefone">Telefone</label>
                        <InputMask id="telefone" v-model="colaborador.telefone" required="true" mask="(99) 99999-9999" placeholder="(99) 99999-9999"
                            autofocus :invalid="submitted && !colaborador.telefone" />
                        <small class="p-error" v-if="submitted && !colaborador.nome">Telefone é obrigatório.</small>
                    </div>

                </div>

                <div class="flex flex-column flex-1">

                    <div class="field">
                        <label for="data-nasc">Data de Nascimento</label>
                        <Calendar v-model="colaborador.dataNascimento" showIcon :showOnFocus="false" :dateFormat="dd/mm/yy" inputId="data-nasc" autofocus :invalid="submitted && !colaborador.dataNascimento"  />
                        <small class="p-error" v-if="submitted && !colaborador.nome">Data de nascimento é obrigatório.</small>
                    </div>

                    <div class="field">
                        <label for="tipo-colaborador">Tipo de Colaborador</label>
                        <Dropdown v-model="colaborador.tipo" :options="tiposColaboradores" optionValue="tipo" optionLabel="descricao" placeholder="Selecione"
                        autofocus :invalid="submitted && !colaborador.tipo"/>
                        <small class="p-error" v-if="submitted && !colaborador.nome">Tipo de colaborador é obrigatório.</small>
                    </div>

                </div>

            </div>

            <p class="mb-2">Chave <strong>Pix</strong></p>

            <div id="inputpix" class="flex flex-column gap-4 p-3 border-300 border-1 border-round max-w-max">

                <div class="flex flex-row gap-2">

                    <div v-for="tipoChavePix in tiposChavePix">

                        <div :class="colaborador.pix.tipo === tipoChavePix.tipo ? 'tipo-chave-button-selecionada' : '' "
                            class="tipo-chave-button flex flex-column justify-content-center align-content-center align-items-center
                            border-1 border-round border-300 shadow-1 hover:shadow-3" @click="setTipoPix(tipoChavePix.tipo)">

                            <span style="color: #3da9fc;">
                                <div v-if="tipoChavePix.tipo === 'CELULAR'">  <i class="pix-icon pi pi-mobile                 text-3xl font-light border-circle p-3"></i></div>
                                <div v-if="tipoChavePix.tipo === 'CPF'">      <i class="pix-icon pi pi-id-card                text-3xl font-light border-circle p-3"></i></div>
                                <div v-if="tipoChavePix.tipo === 'CNPJ'">     <i class="pix-icon pi pi-building               text-3xl font-light border-circle p-3"></i></div>
                                <div v-if="tipoChavePix.tipo === 'EMAIL'">    <i class="pix-icon pi pi-envelope               text-3xl font-light border-circle p-3"></i></div>
                                <div v-if="tipoChavePix.tipo === 'ALEATORIA'"><i class="pix-icon pi pi-arrow-right-arrow-left text-3xl font-light border-circle p-3"></i></div>
                            </span>

                            <p class="mt-3 font-medium text-base text-700">{{tipoChavePix.descricao}}</p>

                        </div>

                    </div>

                </div>

                <div v-if="colaborador.pix.tipo" class="fadein animation-duration-500">
                    <div v-if="colaborador.pix.tipo === 'CELULAR'">
                        <label for="chave-celular">Informe o celular</label>
                        <InputMask id="chave-celular" v-model="colaborador.pix.chave" required="true" mask="(99) 99999-9999" placeholder="(99) 99999-9999"
                            autofocus :invalid="submitted && !colaborador.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaborador.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaborador.pix.tipo === 'CPF'">
                        <label for="chave-cpf">Informe o CPF</label>
                        <InputMask id="chave-cpf" v-model="colaborador.pix.chave" required="true" mask="999.999.999-99" placeholder="999.999.999-99"
                            autofocus :invalid="submitted && !colaborador.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaborador.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaborador.pix.tipo === 'CNPJ'">
                        <label for="chave-cnpj">Informe o CNPJ</label>
                        <InputMask id="chave-cnpj" v-model="colaborador.pix.chave" required="true" mask="99.999.999/9999-99" placeholder="99.999.999/9999-99"
                            autofocus :invalid="submitted && !colaborador.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaborador.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaborador.pix.tipo === 'EMAIL'">
                        <label for="chave-email">Informe o email</label>
                        <InputText id="chave-email" v-model.trim="colaborador.pix.chave" required="true" autofocus :invalid="submitted && !colaborador.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaborador.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaborador.pix.tipo === 'ALEATORIA'">
                        <label for="chave-aleatoria">Informe a chave aleatória</label>
                        <InputText id="chave-aleatoria" v-model.trim="colaborador.pix.chave" required="true" autofocus :invalid="submitted && !colaborador.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaborador.pix.chave">Chave Pix é obrigatória.</small>
                    </div>
                </div>

            </div>

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
    import { ref, onMounted, onBeforeMount, computed } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { ColaboradorService } from '@/service/ColaboradorService';

    const toast = useToast();

    const colaboradorService = new ColaboradorService();

    const dt = ref();

    const tiposColaboradores = ref([]);
    const tiposChavePix = ref([]);

    const colaboradores = ref([]);
    const colaboradorDialog = ref(false);
    const deleteColaboradorDialog = ref(false);
    const deleteColaboradoresDialog = ref(false);
    const colaborador = ref({});
    const colaboradoresSelecionados = ref();

    const filters = ref({});
    const submitted = ref(false);

    const expandedRows = ref({});


    onBeforeMount(() => {
        initFilters();
    });


    onMounted(() => {
        colaboradorService.getColaboradores()
            .then((data) => (colaboradores.value = data))
            .catch((error) => (console.error('Erro ao obter colaboradores:', error)));

        colaboradorService.getTiposColaboradores()
            .then((data) => (tiposColaboradores.value = data))
            .catch((error) => (console.error('Erro ao obter tiposColaboradores:', error)));

        colaboradorService.getTiposChavePix()
            .then((data) => (tiposChavePix.value = data))
            .catch((error) => (console.error('Erro ao obter tiposChavePix:', error)));
    });


    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
    };


    const onRowExpand = (event) => {
        //toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    };


    const onRowCollapse = (event) => {
        //toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    };


    const expandAll = () => {
        expandedRows.value = colaboradores.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    };


    const collapseAll = () => {
        expandedRows.value = null;
    };


    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    const setTipoPix = (value) => {
        colaborador.value.pix.tipo = value;
    };


    const novoColaborador = () => {
        colaborador.value = {};
        colaborador.value.pix = {"tipo": null};
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

    const totalValesColaborador = (value) => {
        let total = 0;

        console.log(value)

        for(let vale of value.vales) {
            total += vale.valor;
        }

        return formatCurrency(total);
    };
</script>
