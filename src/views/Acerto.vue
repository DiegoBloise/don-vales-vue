<style scoped>
</style>

<template>
    <div class="card">

        <Toolbar class="mb-4">

            <template #start>
                <Button label="Novo Acerto" icon="pi pi-plus" severity="success" @click="novoAcerto" />
            </template>

        </Toolbar>

        <DataTable
            ref="dt"
            :value="entregadores"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            removableSort
            striped-rows
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Exibindo de {first} à {last} de {totalRecords} entregadores">

            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h4 class="m-0">Acerto de Entregadores</h4>
                    <IconField iconPosition="left">
                        <InputIcon class="pi pi-search" />
                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column field="nome" header="Entregador" sortable />

        </DataTable>

        <Dialog
            v-model:visible="acertoDialog"
            header="Acerto"
            :modal="true"
            class="p-fluid max-w-min fadein animation-duration-900"
            :closable="false"
            :closeOnEscape="false"
            >

            <!-- relative z-0" style="height: 550px; width: 560px;"> -->
            <div class="flex flex-column fadein animation-duration-300 gap-4 m-2">

                <div class="flex flex-column gap-2">

                    <div class="flex flex-row gap-2 align-items-end justify-content-center ui-fluid">

                        <div class="field flex flex-column flex-grow-1">
                            <label for="data-inicio">Data Inicio:</label>
                            <Calendar class="w-12rem" id="data-inicio" v-model="dataInicio" showIcon :showOnFocus="false" dateFormat="dd/mm/yy"
                                autofocus :invalid="submitted && !dataInicio" />
                            <small class="p-error" v-if="submitted && !dataInicio">Data início é obrigatório.</small>
                        </div>

                        <div class="field flex flex-column flex-grow-1">
                            <label for="data-fim">Data Fim:</label>
                            <Calendar class="w-12rem" id="data-fim" v-model="dataFim" showIcon :showOnFocus="false" dateFormat="dd/mm/yy"
                                autofocus :invalid="submitted && !dataFim" />
                            <small class="p-error" v-if="submitted && !dataFim">Data fim é obrigatório.</small>
                        </div>

                        <div class="field flex flex-column flex-grow-1">
                            <Button class="w-15rem" label="Buscar Entregadores" icon="pi pi-search" severity="success" @click="buscarEntregadores" />
                        </div>

                    </div>

                    <div class="flex flex-row gap-2 justify-content-center align-items-end ui-fluid">

                        <div class="field flex flex-column flex-grow-1">
                            <label for="entregadores">Entregador</label>
                            <Dropdown :disabled="entregadores == null" id="entregadores" v-model="entregadorSelecionado" :options="entregadores" optionValue="entregador" optionLabel="nome" placeholder="Selecione"
                                autofocus :invalid="submitted && !entregadorSelecionado"/>
                            <small class="p-error" v-if="submitted && !entregadorSelecionado">Entregador é obrigatório.</small>
                        </div>

                        <div class="field">
                            <Button class="w-15rem" :disabled="entregadores == null" label="Calcular Total" icon="pi pi-dollar" severity="success" @click="realizarAcerto" />
                        </div>

                    </div>

                </div>

                <!--min-w-max"> -->
                <div v-if="entregadorSelecionado.valorTotalComDesconto != null" class="flex flex-row justify-content-center p-3 border-300 border-1 border-round">

                    <div v-if="entregadorSelecionado.valorTotalComDesconto == null" class="flex flex-column mx-6 gap-2 justify-content-center">
                        <Skeleton  width="12rem" class="mb-2"/>
                        <Skeleton  width="8rem" class="mb-2"/>
                        <Skeleton  width="7rem" class="mb-2"/>
                        <Skeleton  width="12rem" class="mt-5"/>
                    </div>

                    <div v-if="entregadorSelecionado.valorTotalComDesconto" class="flex flex-column mx-6 gap-2 justify-content-center">

                        <div class="flex flex-row gap-3 justify-content-between">
                            <span class="font-semibold">Colaborador:</span>
                            <span>{{ entregadorSelecionado.nome }}"</span>
                        </div>

                        <div class="flex flex-row gap-3 justify-content-between">
                            <span class="font-semibold">Qtde de Diárias:</span>
                            <span>{{ entregadorSelecionado.qtdTotalDias }}</span>
                        </div>

                        <div class="flex flex-row gap-3 justify-content-between">
                            <span class="font-semibold">"Total de entregas:"</span>
                            <span>{{ entregadorSelecionado.qtdEntregas }}</span>
                        </div>

                        <div class="flex flex-row gap-3 justify-content-between mt-5">
                            <span class="font-semibold">Total Receber:</span>
                            <span>{{ formatCurrency(entregadorSelecionado.valorTotalComDesconto) }}</span>
                        </div>

                    </div>

                    <Divider layout="vertical"/>

                    <Skeleton v-if="entregadorSelecionado.valorTotalComDesconto == null" width="10rem" height="10rem" class="mx-6"/>
                    <!-- <p:barcode rendered="#{not empty acertoView.entregadorSelecionado.valorTotalComDesconto}" class="mx-6" type="qr" value="#{acertoView.entregadorSelecionado.gerarPayloadPix()}" width="125" height="125"/> -->

                </div>

                <DataTable
                    v-if="entregadorSelecionado.valorTotalComDesconto != null"
                    ref="dt"
                    :value="acertos"
                    dataKey="id"
                    :rows="10"
                    removableSort
                    striped-rows>

                    <Column field="data" header="Data da Entrega" sortable />

                    <Column field="qtdeEntregasDia" header="Qtde Entregas" sortable />

                    <Column field="valorDiaria" header="Valor Diária" sortable />

                    <Column field="qtdeIFood" header="Qtde de IFood" sortable />

                    <Column field="valorValeDia" header="Valor Vale" sortable />

                    <ColumnGroup type="footer">
                        <Row>
                            <Column footer="Totais:" :colspan="1" footerStyle="text-align:right" />
                            <Column :footer="entregadorSelecionado.valorTotalEntregas" />
                            <Column :footer="entregadorSelecionado.valorTotalDiarias" />
                            <Column :footer="entregadorSelecionado.valorTotalIfood" />
                            <Column :footer="entregadorSelecionado.valorTotalSemDesconto" />
                            <Column :footer="entregadorSelecionado.valorTotalVales" class="font-bold"/>
                        </Row>

                        <Row>
                            <Column footer="Saldo:" :colspan="5" footerStyle="text-align:right" />
                            <Column :footer="entregadorSelecionado.valorSaldo" class="font-bold" />
                        </Row>

                        <Row>
                            <Column footer="Receber:" :colspan="5" footerStyle="text-align:right" />
                            <Column :footer="entregadorSelecionado.valorTotalComDesconto" class="font-bold" />
                        </Row>
                    </ColumnGroup>

                </DataTable>

            </div>

            <template #footer>
                <Button label="Fechar" icon="pi pi-times" text @click="hideAcertoDialog"/>
                <Button :disabled="mensagemWhatsapp == null" label="Copiar Recibo" icon="pi pi-copy" @click="copyValeToClipboard" />
            </template>

        </Dialog>

    </div>

</template>

<script setup>
import { EntregadorService } from '@/service/EntregadorService';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

const entregadorService = new EntregadorService();

const toast = useToast();
const filters = ref({});
const dt = ref();
const acertoDialog = ref(false);

const entregadores = ref();
const acertos = ref();

const entregadorSelecionado = ref({});

const dataInicio = ref();
const dataFim = ref();
const mensagemWhatsapp = ref();


// Upload De Arquivo
//const dataMovimento = ref(); */
//const entregas = ref();
//const dataSelecionada = ref();

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    /* // Upload De Arquivo
    entregas = entregaService.listar();
    entregadores = new ArrayList<>();

    dataSelecionada = new Date();
    dataMovimento = Util.converteLocalDate(dataSelecionada); */
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const novoAcerto = () => {
    acertoDialog.value = true;
}

const buscarEntregadores = () => {
    entregadorService.getEntregadoresPorData(dataFormatada(dataInicio.value), dataFormatada(dataFim.value))
            .then((data) => (entregadores.value = data))
            .then(() => {
                if (entregadores.value) {
                    toast.add({severity:'warn', summary: 'Nenhum entregador encontrado', detail: 'Não foi possível encontrar entregadores no período especificado', life: 3000});
                } else {
                    toast.add({severity:'info', summary: `${entregadores.value.length} entregadores encontrados`, detail: 'Selecione um entregador para prosseguir', life: 3000});
                }
            })
            .catch((error) => {
                toast.add({severity:'error', summary: `Erro`, detail: 'Ocorreu um erro ao processar a solicitação', life: 3000});
            });
}

const realizarAcerto = () => {

    entregadorService.realizarAcerto();
}

const hideAcertoDialog = () => {
    acertoDialog.value = false;
}

const copyValeToClipboard = () => {
    let texto = mensagemWhatsapp.value.texto;

    texto = texto.replace("\n", "\\n").replace("\r", "\\r").replace("'", "\\'");

    navigator.clipboard.writeText(texto);

    toast.add({severity:'info', summary: 'Recibo copiado', detail: 'Recibo copiado para a área de transferência.', life: 3000});
}


const dataFormatada = (data) => {
    const year = data.getFullYear();
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const day = data.getDate().toString().padStart(2, '0');

    const dataFormatada = `${year}-${month}-${day}`;

    return dataFormatada;
}




/* public void apagarMovimento() {
    Integer retorno = 0;
    retorno = uploadService.deleterMovimento(dataMovimento);
    FacesContext.getCurrentInstance().addMessage(null,
            new FacesMessage(FacesMessage.SEVERITY_INFO, "Data do movimento apagada!",
                    Util.localDateFormatado(dataMovimento) + System.lineSeparator() + retorno
                            + " registros foram apagados!"));
}
 */

/* public void fileUpload(FileUploadEvent event) {

    try {

        Long verificaData = uploadService.buscarMovimento(dataMovimento);

        if (verificaData != null && verificaData > 0) {
            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR,
                    "Já existe um movimento com a data selecionada!", Util.localDateFormatado(dataMovimento)));
        } else {
            UploadedFile file = event.getFile();

            Integer entregasSalvas = uploadService.trataXML2(file.getInputStream());

            entregas = uploadService.buscarPorData(dataMovimento);
            entregadores = uploadService.listarEntregadoresPorData(dataMovimento);

            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_INFO,
                    "Foram salvos "+ (entregasSalvas + " registros"), Util.localDateFormatado(dataMovimento)));
        }

    } catch (IOException e) {
        e.printStackTrace();
    }
} */
</script>