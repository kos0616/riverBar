import type { RouteRecordRaw } from 'vue-router';
const isDev = import.meta.env.DEV;

const dev = {
  path: '/dev',
  component: () => import('@/CUSTOMER/pages/dev.vue')
};
const arr = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登入'
    },
    component: () => import('@/CUSTOMER/pages/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/CUSTOMER/layout/iws.vue'),
    children: [
      {
        path: '/iws/:id',
        alias: '/iws/:id',
        name: 'gates',
        props: true,
        component: () => import('@/CUSTOMER/pages/gate/index.vue'),
        meta: {
          title: '圖控',
          url: 'iws',
          breadcrumb: [{ label: '圖控', href: '/iws' }]
        }
      },
      {
        path: '/camera/:id',
        name: 'gateCamera',
        props: true,
        component: () => import('@/CUSTOMER/pages/camera/index.vue'),
        meta: {
          title: '圖控',
          url: 'iws',
          breadcrumb: [{ label: '圖控', href: '/iws' }]
        }
      },
      {
        path: '/map',
        name: 'map',
        meta: {
          title: 'MAP 地圖',
          breadcrumb: [{ label: 'MAP 地圖', href: '/map' }]
        },
        component: () => import('@/CUSTOMER/pages/MAP/index.vue')
      },
      {
        path: '/LocationCameras',
        name: 'cctv',
        component: () => import('@/CUSTOMER/pages/cctv/index.vue'),
        meta: {
          title: 'CCTV',
          url: 'LocationCameras',
          breadcrumb: [{ label: 'CCTV', href: '/LocationCameras' }]
        }
      },
      {
        path: '/DisasterCameras',
        name: 'cctv_D',
        component: () => import('@/CUSTOMER/pages/cctvDisaster/index.vue'),
        meta: {
          title: '防災CCTV',
          url: 'DisasterCameras',
          breadcrumb: [{ label: '防災CCTV', href: '/DisasterCameras' }]
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/CUSTOMER/layout/index.vue'),
    children: [
      {
        path: '/histroy',
        name: 'histroy',
        component: () => import('@/CUSTOMER/pages/histroy/lists.vue'),
        meta: {
          title: '水情展示',
          url: 'histroy',
          breadcrumb: [{ label: '水情展示', href: '/histroy' }]
        }
      },
      {
        path: '/log',
        name: 'log',
        component: () => import('@/CUSTOMER/pages/log/lists.vue'),
        meta: {
          title: '操作記錄',
          url: 'log',
          breadcrumb: [{ label: '操作記錄', href: '/log' }]
        }
      },
      {
        path: '/user',
        name: 'user',
        props: true,
        component: () => import('@/CUSTOMER/pages/user/lists.vue'),
        meta: {
          title: '帳號',
          url: 'user',
          breadcrumb: [{ label: '帳號', href: '/user' }]
        }
      },
      {
        path: '/user/create',
        name: 'user-create',
        props: true,
        component: () => import('@/CUSTOMER/pages/user/create.vue'),
        meta: {
          title: '帳號',
          url: 'user',
          breadcrumb: [{ label: '帳號', href: '/user' }]
        }
      },
      {
        path: '/user/:id',
        name: 'user-info',
        props: true,
        component: () => import('@/CUSTOMER/pages/user/info.vue'),
        meta: {
          title: '帳號',
          url: 'user',
          breadcrumb: [{ label: '帳號', href: '/account' }]
        }
      },
      {
        path: '/role',
        name: 'role',
        props: true,
        component: () => import('@/CUSTOMER/pages/role/lists.vue'),
        meta: {
          title: '角色',
          url: 'role',
          breadcrumb: [{ label: '角色', href: '/role' }]
        }
      },
      {
        path: '/role/:id',
        name: 'role-info',
        props: true,
        component: () => import('@/CUSTOMER/pages/role/info.vue'),
        meta: {
          title: '角色',
          url: 'role',
          breadcrumb: [{ label: '角色', href: '/role' }]
        }
      },
      {
        path: '/iws',
        name: 'iws',
        props: true,
        component: () => import('@/CUSTOMER/pages/iws/lists.vue'),
        meta: {
          title: '圖控',
          url: 'iws',
          breadcrumb: [{ label: '圖控', href: '/iws' }]
        }
      },
      {
        path: '/chart/:id',
        name: 'chart',
        props: true,
        component: () => import('@/CUSTOMER/pages/chart/index.vue'),
        meta: {
          title: '圖表記錄',
          url: 'chart',
          breadcrumb: [{ label: '圖表記錄', href: '/chart' }]
        }
      },
      {
        path: '/chart',
        name: 'chart',
        props: true,
        component: () => import('@/CUSTOMER/pages/chart/index.vue'),
        meta: {
          title: '趨勢圖',
          url: 'chart',
          breadcrumb: [{ label: '趨勢圖', href: '/chart' }]
        }
      },
      {
        path: '/flood',
        name: 'flood',
        component: () => import('@/CUSTOMER/pages/flood/lists.vue'),
        meta: {
          title: '汛期監測',
          url: 'flood',
          breadcrumb: [{ label: '汛期監測', href: '/flood' }]
        }
      },
      {
        path: '/alert',
        name: 'alert',
        component: () => import('@/CUSTOMER/pages/alert/lists.vue'),
        meta: {
          title: '警示管理',
          url: 'alert',
          breadcrumb: [{ label: '警示管理', href: '/alert' }]
        }
      },
      {
        path: 'troubleshooting',
        name: 'troubleshooting',
        component: () => import('@/CUSTOMER/pages/troubleshooting/index.vue'),
        meta: {
          title: '故障排除',
          url: 'troubleshooting',
          breadcrumb: [{ label: '故障排除', href: '/troubleshooting' }]
        }
      }
    ]
  }
] as RouteRecordRaw[];

if (isDev) arr.push(dev);

export default arr;
