import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Chains',
    icon: 'nb-shuffle',
    children: [
      {
        title: 'Chains',
        link: '/pages/chains',
      },
      {
        title: 'Add',
        link: '/pages/chains/add',
      },
    ],
  },
  {
    title: 'Processes',
    icon: 'nb-shuffle',
    children: [
      {
        title: 'Processes',
        link: '/pages/processes',
      },
      {
        title: 'Add',
        link: '/pages/processes/add',
      },
    ],
  },
  {
    title: 'Repositories',
    icon: 'nb-shuffle',
    children: [
      {
        title: 'Repositories',
        link: '/pages/repositories',
      },
      {
        title: 'Add',
        link: '/pages/repositories/create',
      },
    ],
  }
];
