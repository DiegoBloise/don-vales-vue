<style scoped>
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

        <Toolbar class="mb-4">

            <template #start>
                <Button label="Novo Colaborador" icon="pi pi-plus" severity="success" class="mr-2" @click="novoColaborador" />
                <Button v-if="isAdmin" label="Remover" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!colaboradoresSelecionados || !colaboradoresSelecionados.length" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Importar" class="mr-2 inline-block" />
                <Button v-if="isAdmin" label="Exportar" icon="pi pi-download" severity="help" @click="exportCSV($event)"  />
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

            <Column v-if="isAdmin" selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

            <Column field="nome" header="Nome" sortable style="min-width:16rem"></Column>

            <Column field="telefone" header="Telefone" sortable style="min-width:16rem"></Column>

            <Column field="tipo" header="Tipo" sortable style="min-width:16rem"></Column>

            <Column field="pix.tipo" header="Chave Pix" sortable style="min-width:16rem">
                <template #body="slotProps">
                    <label>{{ slotProps.data.pix.tipo }}</label>
                    <p>{{ slotProps.data.pix.chave }}</p>
                </template>
            </Column>

            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-ticket" outlined rounded class="mr-2" @click="novoVale(slotProps.data)" />
                    <Button v-if="isAdmin" icon="pi pi-pencil" outlined rounded severity="warning"class="mr-2" @click="editarColaborador(slotProps.data)" />
                    <Button v-if="isAdmin" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteColaborador(slotProps.data)" />
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="p-3">
                    <h5>Vales de {{ slotProps.data.nome }}</h5>
                    <DataTable :value="slotProps.data.vales">
                        <Column field="data" header="Data" sortable>
                            <template #body="slotProps">
                                {{ util.formatData(slotProps.data.data) }}
                            </template>
                        </Column>

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

                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Total:" footerStyle="text-align:right" />
                                <Column colspan="2" :footer="util.formatCurrency(slotProps.data.totalVales)" />
                            </Row>
                        </ColumnGroup>
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

            <div class="flex flex-column">

                <div class="flex flex-row gap-3">

                    <div class="field flex-1">
                        <label for="nome">Nome</label>
                        <InputText id="nome" v-model.trim="colaboradorSelecionado.nome" required="true" autofocus :invalid="submitted && !colaboradorSelecionado.nome" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.nome">Nome é obrigatório.</small>
                    </div>

                    <div class="field flex-1">
                        <label for="telefone">Telefone</label>
                        <InputMask id="telefone" v-model="colaboradorSelecionado.telefone" required="true" mask="(99) 99999-9999" placeholder="(99) 99999-9999"
                            autofocus :invalid="submitted && !colaboradorSelecionado.telefone" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.telefone">Telefone é obrigatório.</small>
                    </div>

                </div>

                <div class="flex flex-row gap-3">

                    <div class="field flex-1">
                        <label for="data-nasc">Data de Nascimento</label>
                        <Calendar v-model="colaboradorSelecionado.dataNascimento" showIcon :showOnFocus="false" dateFormat="dd/mm/yy" inputId="data-nasc" autofocus :invalid="submitted && !colaboradorSelecionado.dataNascimento"  />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.dataNascimento">Data de nascimento é obrigatório.</small>
                    </div>

                    <div class="field flex-1">
                        <label for="tipo-colaborador">Tipo de Colaborador</label>
                        <Dropdown id="tipo-colaborador" v-model="colaboradorSelecionado.tipo" :options="tiposColaboradores" optionValue="tipo" optionLabel="descricao" placeholder="Selecione"
                            autofocus :invalid="submitted && !colaboradorSelecionado.tipo"/>
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.tipo">Tipo de colaborador é obrigatório.</small>
                    </div>

                </div>

            </div>

            <p class="mb-2">Chave <strong>Pix</strong></p>

            <div id="inputpix" class="flex flex-column gap-4 p-3 border-300 border-1 border-round max-w-max">

                <div class="flex flex-row gap-2">

                    <div v-for="tipoChavePix in tiposChavePix">

                        <div :class="colaboradorSelecionado.pix.tipo === tipoChavePix.tipo ? 'tipo-chave-button-selecionada' : '' "
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

                <div v-if="colaboradorSelecionado.pix.tipo" class="fadein animation-duration-500">
                    <div v-if="colaboradorSelecionado.pix.tipo === 'CELULAR'">
                        <label for="chave-celular">Informe o celular</label>
                        <InputMask id="chave-celular" v-model="colaboradorSelecionado.pix.chave" required="true" mask="(99) 99999-9999" placeholder="(99) 99999-9999"
                            autofocus :invalid="submitted && !colaboradorSelecionado.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaboradorSelecionado.pix.tipo === 'CPF'">
                        <label for="chave-cpf">Informe o CPF</label>
                        <InputMask id="chave-cpf" v-model="colaboradorSelecionado.pix.chave" required="true" mask="999.999.999-99" placeholder="999.999.999-99"
                            autofocus :invalid="submitted && !colaboradorSelecionado.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaboradorSelecionado.pix.tipo === 'CNPJ'">
                        <label for="chave-cnpj">Informe o CNPJ</label>
                        <InputMask id="chave-cnpj" v-model="colaboradorSelecionado.pix.chave" required="true" mask="99.999.999/9999-99" placeholder="99.999.999/9999-99"
                            autofocus :invalid="submitted && !colaboradorSelecionado.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaboradorSelecionado.pix.tipo === 'EMAIL'">
                        <label for="chave-email">Informe o email</label>
                        <InputText id="chave-email" v-model.trim="colaboradorSelecionado.pix.chave" required="true" autofocus :invalid="submitted && !colaboradorSelecionado.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.pix.chave">Chave Pix é obrigatória.</small>
                    </div>

                    <div v-if="colaboradorSelecionado.pix.tipo === 'ALEATORIA'">
                        <label for="chave-aleatoria">Informe a chave aleatória</label>
                        <InputText id="chave-aleatoria" v-model.trim="colaboradorSelecionado.pix.chave" required="true" autofocus :invalid="submitted && !colaboradorSelecionado.pix.chave" />
                        <small class="p-error" v-if="submitted && !colaboradorSelecionado.pix.chave">Chave Pix é obrigatória.</small>
                    </div>
                </div>

            </div>

        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" text @click="hideColaboradorDialog"/>
            <Button label="Salvar" icon="pi pi-check" text @click="salvarColaborador" />
        </template>

    </Dialog>

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
                    <label for="nome">Colaborador</label>
                    <p><b>{{ valeSelecionado.colaboradorNome }}</b></p>
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

    <Dialog v-model:visible="deleteColaboradorDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="colaboradorSelecionado">Tem certeza que deseja remover <b>{{colaboradorSelecionado.nome}}</b>?</span>
        </div>

        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteColaboradorDialog = false"/>
            <Button label="Sim" icon="pi pi-check" text @click="deletarColaborador" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteColaboradoresDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="colaboradoresSelecionados">Tem certeza que deseja remover os colaboradores selecionados?</span>
        </div>

        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteColaboradoresDialog = false"/>
            <Button label="Sim" icon="pi pi-check" text @click="deletarColaboradoresSelecionados" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteValeDialog" :style="{width: '450px'}" header="Confirmação" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="valeSelecionado">Tem certeza que deseja remover o vale de <b>{{ colaboradorSelecionado.nome }}</b>
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

    const tiposColaboradores = ref([]);
    const tiposChavePix = ref([]);
    const tiposVales = ref([]);

    const colaboradores = ref([]);
    const colaboradorDialog = ref(false);
    const valeDialog = ref(false);
    const deleteValeDialog = ref(false);
    const deleteColaboradorDialog = ref(false);
    const deleteColaboradoresDialog = ref(false);
    const colaboradorSelecionado = ref();
    const valeSelecionado = ref();
    const colaboradoresSelecionados = ref();

    const isAdmin = ref(true);

    const filters = ref({});
    const submitted = ref(false);

    const expandedRows = ref({});

    onBeforeMount(() => {
        initFilters();
    });

    onMounted(() => {
        getColaboradores();

        tipoService.getTiposColaboradores()
            .then((data) => (tiposColaboradores.value = data))
            .catch((error) => (console.error('Erro ao obter tiposColaboradores:', error)));

        tipoService.getTiposChavePix()
            .then((data) => (tiposChavePix.value = data))
            .catch((error) => (console.error('Erro ao obter tiposChavePix:', error)));

        tipoService.getTiposVales()
            .then((data) => (tiposVales.value = data))
            .catch((error) => (console.error('Erro ao obter tiposVales:', error)));
    });

    const getColaboradores = () => {
        colaboradorService.getColaboradores()
            .then((data) => (colaboradores.value = data))
            .then(() => (totalValesColaborador()))
            .catch((error) => (console.error('Erro ao obter colaboradores:', error)));
    }

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

    const setTipoPix = (value) => {
        colaboradorSelecionado.value.pix.tipo = value;
        colaboradorSelecionado.value.pix.chave = null;
    };

    const hideColaboradorDialog = () => {
        colaboradorDialog.value = false;
        submitted.value = false;
    };

    const hideValeDialog = () => {
        valeDialog.value = false;
        submitted.value = false;
    };

    const salvarColaborador = () => {
        submitted.value = true;

        if (colaboradorSelecionado.value.nome &&
            colaboradorSelecionado.value.telefone &&
            colaboradorSelecionado.value.dataNascimento &&
            colaboradorSelecionado.value.pix.tipo &&
            colaboradorSelecionado.value.pix.chave
            ) {

            if (colaboradorSelecionado.value.id) {
                colaboradorService.atualizarColaborador(colaboradorSelecionado.value.id, colaboradorSelecionado.value)
                    .then(() => {
                        toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Atualizado.', life: 3000});
                        getColaboradores();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível atualizar o colaborador', life: 3000});
                    })
            } else {

                colaboradorService.salvarColaborador(colaboradorSelecionado.value)
                    .then(() => {
                        toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Cadastrado', life: 3000});
                        getColaboradores();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível cadastrar o colaborador', life: 3000});
                    })
            }

            colaboradorDialog.value = false;

            colaboradorSelecionado.value = {};
        }
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
                        getColaboradores();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível atualizar o vale', life: 3000});
                    })
            } else {

                valeService.salvarVale(valeSelecionado.value)
                    .then(() => {
                        toast.add({severity:'success', summary: 'Sucesso', detail: 'Vale Cadastrado', life: 3000});
                        getColaboradores();
                    }).catch(() => {
                        toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível cadastrar o vale', life: 3000});
                    })
            }

            valeDialog.value = false;

            valeSelecionado.value = {};
        }

    };

    const novoVale = (colaborador) => {
        colaboradorSelecionado.value = {...colaborador};
        valeSelecionado.value = {}
        valeSelecionado.value.colaboradorId = colaboradorSelecionado.value.id;
        submitted.value = false;
        valeDialog.value = true;
    };

    const novoColaborador = () => {
        colaboradorSelecionado.value = {'pix':{}};
        submitted.value = false;
        colaboradorDialog.value = true;
    };

    const editarColaborador = (colaborador) => {
        colaboradorSelecionado.value = JSON.parse(JSON.stringify(colaborador));
        colaboradorSelecionado.value.dataNascimento = util.formatData(colaboradorSelecionado.value.dataNascimento);
        //colaboradorSelecionado.value = {...colaborador};
        colaboradorDialog.value = true;
    };

    const editarVale = (vale) => {
        valeSelecionado.value = JSON.parse(JSON.stringify(vale));

        colaboradorSelecionado.value = {...colaboradores.value.find(colab => colab.id === valeSelecionado.value.colaboradorId)};

        valeSelecionado.value.valor = util.floatParaReal(valeSelecionado.value.valor);
        valeSelecionado.value.data = util.formatData(valeSelecionado.value.data);

        valeDialog.value = true;
    };

    const confirmDeleteColaborador = (colaborador) => {
        colaboradorSelecionado.value = {...colaborador};
        deleteColaboradorDialog.value = true;
    };

    const confirmDeleteVale = (vale) => {
        valeSelecionado.value = {...vale};

        colaboradorSelecionado.value = {...colaboradores.value.find(colab => colab.id === valeSelecionado.value.colaboradorId)};

        deleteValeDialog.value = true;
    };

    const deletarColaborador = () => {
        colaboradorService.deletarColaborador(colaboradorSelecionado.value.id)
            .then(() => {
                toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaborador Removido', life: 3000});
                getColaboradores();
            }).catch(() => {
                toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível remover o colaborador', life: 3000});
            })

        deleteColaboradorDialog.value = false;
        colaboradorSelecionado.value = {};
    };

    const deletarVale = () => {
        valeService.deletarVale(valeSelecionado.value.id)
            .then(() => {
                toast.add({severity:'success', summary: 'Sucesso', detail: 'Vale Removido', life: 3000});
                getColaboradores();
            }).catch(() => {
                toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível remover o vale', life: 3000});
            })

        deleteValeDialog.value = false;
        valeSelecionado.value = {};
        colaboradorSelecionado.value = {};
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

    const deletarColaboradoresSelecionados = async () => {
        try {
            await Promise.all(colaboradoresSelecionados.value.map(async (colaborador) => {
                await colaboradorService.deletarColaborador(colaborador.id);
            }));

            toast.add({severity:'success', summary: 'Sucesso', detail: 'Colaboradores Removidos', life: 3000});
        } catch (error) {
            toast.add({severity:'error', summary: 'Erro', detail: 'Não foi possível remover os colaboradores selecionados', life: 3000});
        } finally {
            getColaboradores();
            deleteColaboradoresDialog.value = false;
            colaboradoresSelecionados.value = null;
        }
    };

    const totalValesColaborador = () => {
        for (const colaborador of colaboradores.value) {
            colaboradorService.getValesColaborador(colaborador.id)
                .then((data) => (colaborador.vales = data))
                .catch((error) => (console.error('Erro ao obter vales:', error)));
        }
    };

/////buguei kkkkkkk
    /* const totalValesColaborador = () => {
        for (const colaborador of colaboradores.value) {
            colaboradorService.getValesColaborador(colaborador.id)
                .then((data) => (colaborador.vales = data))
                .then(() => (totalValesColaborador()))
                .catch((error) => (console.error('Erro ao obter vales:', error)));
        }
    }; */


    const formatValeInput = () => {
        valeSelecionado.value.valor = util.formatMoneyInput(valeSelecionado.value.valor);
    }

</script>
