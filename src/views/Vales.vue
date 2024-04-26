<style scoped>

</style>

<template>

    <div class="card">

        <Toolbar class="mb-4">

            <template #start>
                <Button label="Lançar Vale" icon="pi pi-plus" severity="success" class="mr-2" @click="novoVale" />
            </template>

        </Toolbar>


        <DataTable
            ref="dt"
            :value="vales"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            removableSort
            striped-rows
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Exibindo de {first} à {last} de {totalRecords} vales">

            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h4 class="m-0">Gerenciamento de Vales</h4>
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search" />
                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column field="data" header="Data" sortable>
                <template #body="slotProps">
                    {{ util.formatData(slotProps.data.data) }}
                </template>
            </Column>

            <Column field="colaboradorNome" header="Colaborador" sortable></Column>

            <Column field="valor" header="Valor" sortable>
                <template #body="slotProps">
                    {{ util.formatCurrency(slotProps.data.valor) }}
                </template>
            </Column>

            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-print" outlined rounded severity="help" class="mr-2" @click="util.todo" />
                    <Button v-if="isAdmin" icon="pi pi-pencil" outlined rounded severity="warning" class="mr-2" @click="editarVale(slotProps.data)" />
                    <Button v-if="isAdmin" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteVale(slotProps.data)" />
                </template>
            </Column>

        </DataTable>

    </div>

    <Dialog
        v-model:visible="valeDialog"
        header="Lançamento de Vale"
        :modal="true"
        class="p-fluid max-w-min"
        :closable="false"
        :closeOnEscape="false"
        >

            <div>
                <div class="field">
                    <label for="tipo-vale">Colaborador</label>
                    <Dropdown :disabled="valeSelecionado.id" id="colaborador" v-model="valeSelecionado.colaboradorId" :options="colaboradores" optionValue="id" optionLabel="nome" placeholder="Selecione"
                        autofocus :invalid="submitted && !valeSelecionado.colaboradorId"/>
                    <small class="p-error" v-if="submitted && !valeSelecionado.colaboradorId">Colaborador é obrigatório.</small>
                </div>

                <div v-if="isAdmin" class="field">
                    <label for="data-vale">Data do Vale</label>
                    <Calendar :disabled="true" v-model="valeSelecionado.data" showIcon :showOnFocus="false" dateFormat="dd/mm/yy" inputId="data-vale"
                        autofocus :invalid="submitted && !valeSelecionado.data" />
                    <small class="p-error" v-if="submitted && !valeSelecionado.data">Data do vale é obrigatório.</small>
                </div>

                <div class="field">
                    <label for="valor-vale">Valor</label>
                    <InputText id="valor-vale" v-model.trim="valeSelecionado.valor" placeholder="R$ 0,00"required="true"
                        autofocus :invalid="submitted && !valeSelecionado.valor" @input="formatValeInput(valeSelecionado)" />
                    <small class="p-error" v-if="submitted && !valeSelecionado.valor">Valor do vale é obrigatório.</small>
                </div>

                <div v-if="isAdmin" class="field">
                    <label for="tipo-vale">Tipo de Vale</label>
                    <Dropdown id="tipo-vale" v-model="valeSelecionado.tipo" :options="tiposVales" optionValue="tipo" optionLabel="descricao" placeholder="Selecione"
                        autofocus :invalid="submitted && !valeSelecionado.tipo"/>
                    <small class="p-error" v-if="submitted && !valeSelecionado.tipo">Tipo de vale é obrigatório.</small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideValeDialog"/>
                <Button label="Salvar" icon="pi pi-check" text @click="salvarVale" />
            </template>

    </Dialog>

    <Dialog v-if="isAdmin" v-model:visible="deleteValeDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="valeSelecionado">Tem certeza que deseja remover o vale de <b>{{ valeSelecionado.colaboradorNome }}</b>
                no valor de <b>{{util.formatCurrency(valeSelecionado.valor)}}</b>?</span>
        </div>

        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteValeDialog = false"/>
            <Button label="Sim" icon="pi pi-check" text @click="deletarVale" />
        </template>
    </Dialog>

</template>

<script setup>
    import { ColaboradorService } from '@/service/ColaboradorService';
    import { TipoService } from '@/service/TipoService';
    import { ValeService } from '@/service/ValeService';
    import { FilterMatchMode } from 'primevue/api';
    import { useToast } from 'primevue/usetoast';
    import { onBeforeMount, onMounted, ref } from 'vue';
    import { Util } from '@/service/Util';

    const toast = useToast();

    const util = new Util();
    const colaboradorService = new ColaboradorService();
    const valeService = new ValeService();
    const tipoService = new TipoService

    const dt = ref();

    const tiposVales = ref([]);

    const colaboradores = ref([]);
    const vales = ref([]);
    const valeDialog = ref(false);
    const deleteValeDialog = ref(false);
    const colaboradorSelecionado = ref();
    const valeSelecionado = ref();

    const isAdmin = ref(true);

    const filters = ref({});
    const submitted = ref(false);

    onBeforeMount(() => {
        initFilters();
    });

    onMounted(() => {
        getVales();

        colaboradorService.getColaboradores()
            .then((data) => (colaboradores.value = data))
            .catch((error) => (console.error('Erro ao obter colaboradores:', error)));

        tipoService.getTiposVales()
            .then((data) => (tiposVales.value = data))
            .catch((error) => (console.error('Erro ao obter tiposVales:', error)));
    });

    const getVales = () => {
        valeService.getVales()
            .then((data) => (vales.value = data))
            .catch((error) => (console.error('Erro ao obter vales:', error)));
    }

    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
        };
    };

    const hideValeDialog = () => {
        valeDialog.value = false;
        submitted.value = false;
    };

    const salvarVale = () => {
        submitted.value = true;

        if (valeSelecionado.value.valor) {

            valeSelecionado.value.valor = util.realParaFloat(valeSelecionado.value.valor);

            if(valeSelecionado.value.data) {
                valeSelecionado.value.data = util.formatStringToLocalDate(valeSelecionado.value.data);
            }

            if (valeSelecionado.value.id) {

                valeService.atualizarVale(valeSelecionado.value.id, valeSelecionado.value)
                    .then(() => {
                        toast.add({severity:'success', summary: 'Sucesso', detail: 'Vale Atualizado.', life: 3000});
                        getVales();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível atualizar o vale', life: 3000});
                    })
            } else {

                valeService.salvarVale(valeSelecionado.value)
                    .then(() => {
                        toast.add({severity:'success', summary: 'Sucesso', detail: 'Vale Cadastrado', life: 3000});
                        getVales();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível cadastrar o vale', life: 3000});
                    })
            }

            valeDialog.value = false;

            valeSelecionado.value = {};
        }

    };

    const novoVale = () => {
        valeSelecionado.value = {}
        submitted.value = false;
        valeDialog.value = true;
    };

    const editarVale = (vale) => {
        valeSelecionado.value = JSON.parse(JSON.stringify(vale));

        colaboradorSelecionado.value = {...colaboradores.value.find(colab => colab.id === valeSelecionado.value.colaboradorId)};

        valeSelecionado.value.valor = util.floatParaReal(valeSelecionado.value.valor);
        valeSelecionado.value.data = util.formatData(valeSelecionado.value.data);

        valeDialog.value = true;
    };

    const confirmDeleteVale = (vale) => {
        valeSelecionado.value = {...vale};

        colaboradorSelecionado.value = {...colaboradores.value.find(colab => colab.id === valeSelecionado.value.colaboradorId)};

        deleteValeDialog.value = true;
    };

    const deletarVale = () => {
        valeService.deletarVale(valeSelecionado.value.id)
            .then(() => {
                toast.add({severity:'success', summary: 'Sucesso', detail: 'Vale Removido', life: 3000});
                getVales();
            }).catch(() => {
                toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível remover o vale', life: 3000});
            })

        deleteValeDialog.value = false;
        valeSelecionado.value = {};
        colaboradorSelecionado.value = {};
    };

    const formatValeInput = () => {
        valeSelecionado.value.valor = util.formatMoneyInput(valeSelecionado.value.valor);
    }

</script>
