import { NbMenuItem } from '@nebular/theme';


export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Chains',
    icon: 'nb-shuffle',
    children: [
      {
        title: 'Manage',
        link: '/pages/chains',
      },
      {
        title: 'Register',
        link: '/pages/add-chain',
      },
    ],
  },
  {
    title: 'Processes',
    icon: 'nb-loop',
    children: [
      {
        title: 'Manage',
        link: '/pages/processes',
      },
      {
        title: 'Register',
        link: '/pages/add-process',
      },
    ],
  },
  {
    title: 'Repositories',
    icon: 'nb-cloudy',
    children: [
      {
        title: 'Manage',
        link: '/pages/repositories',
      },
      {
        title: 'Register',
        link: '/pages/add-repository',
      },
    ],
  }
];
