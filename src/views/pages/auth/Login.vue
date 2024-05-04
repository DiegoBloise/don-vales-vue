<script setup>
/* import { useLayout } from '@/layout/composables/layout'; */
import { ref } from 'vue';
import axios from 'axios';
/* import AppConfig from '@/layout/AppConfig.vue'; */
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/store/AuthStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const auth = useAuthStore();
const toast = useToast();

/* const { layoutConfig } = useLayout(); */
const email = ref('');
const password = ref('');
const checked = ref(false);

/* const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
}); */

const loginUser = () => {
    try {
        axios
            .post('http://localhost:8080/api/auth/login', {
                username: email.value,
                password: password.value
            })
            .then((response) => {
                const token = response.data.token;

                auth.setToken(token);
            })
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao fazer login', life: 3000 });
                console.error(error);
            });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Credenciais inválidas.', life: 3000 });
    }
};
</script>

<template>
    <Toast />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="DON logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
                        <span class="text-600 font-medium">Faça o login para continuar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Usuário</label>
                        <InputText id="email1" type="text" placeholder="Usuário" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Senha</label>
                        <Password :feedback="false" id="password1" v-model="password" placeholder="Senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Lembrar senha</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Esqueceu a senha?</a>
                        </div>
                        <Button label="Entrar" class="w-full p-3 text-xl" @click="loginUser"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <AppConfig simple /> -->
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
