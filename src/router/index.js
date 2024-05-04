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
                },
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Input.vue')
                },
                {
                    path: '/uikit/floatlabel',
                    name: 'floatlabel',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/FloatLabel.vue')
                },
                {
                    path: '/uikit/invalidstate',
                    name: 'invalidstate',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/InvalidState.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Button.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Table.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/List.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Tree.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Panels.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Overlay.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Media.vue')
                },
                {
                    path: '/uikit/menu',
                    component: () => import('@/views/uikit/Menu.vue'),
                    children: [
                        {
                            path: '/uikit/menu',
                            meta: { requiresAuth: true },
                            component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                        },
                        {
                            path: '/uikit/menu/seat',
                            meta: { requiresAuth: true },
                            component: () => import('@/views/uikit/menu/SeatDemo.vue')
                        },
                        {
                            path: '/uikit/menu/payment',
                            meta: { requiresAuth: true },
                            component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                        },
                        {
                            path: '/uikit/menu/confirmation',
                            meta: { requiresAuth: true },
                            component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                        }
                    ]
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Messages.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/File.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Chart.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/uikit/Misc.vue')
                },
                {
                    path: '/blocks',
                    name: 'blocks',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/utilities/Blocks.vue')
                },
                {
                    path: '/utilities/icons',
                    name: 'icons',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/utilities/Icons.vue')
                },
                {
                    path: '/pages/timeline',
                    name: 'timeline',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Timeline.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    meta: { requiresAuth: true },
                    component: () => import('@/views/utilities/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
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

router.beforeEach((to) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.isLoggedIn()) {
        return { name: 'login' };
    }
});

export default router;
