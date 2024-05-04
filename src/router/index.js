import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/store/AuthStore';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'vales',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/Vales.vue')
                },
                {
                    path: '/colaboradores',
                    name: 'colaboradores',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/Colaboradores.vue')
                },
                {
                    path: '/acerto',
                    name: 'acerto',
                    meta: { requiresAuth: true, requiresAdminRole: true },
                    component: () => import('@/views/admin/Acerto.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isLoggedIn()) {
        return { name: 'login' };
    }

    if (to.name === 'login' && auth.isLoggedIn()) {
        return { name: from.name };
    }

    if (to.meta.requiresAdminRole && !auth.isAdmin()) {
        return { name: 'accessDenied' };
    }
});

export default router;
