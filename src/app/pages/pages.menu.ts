export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'chains',
        data: {
          menu: {
            title: 'general.menu.chains',
            icon: 'ion-merge',
            selected: false,
            expanded: false,
            order: 1,
          },
        },
        children: [
          {
            path: '',
            data: {
              menu: {
                title: 'general.menu.chains',
              },
            },
          },
          {
            path: 'create',
            data: {
              menu: {
                title: 'general.menu.chains_create',
              },
            },
          },
        ],
      },
      {
        path: 'processes',
        data: {
          menu: {
            title: 'general.menu.processes',
            icon: 'ion-ios-cog',
            selected: false,
            expanded: false,
            order: 0,
          },
        },
        children: [
          {
            path: '',
            data: {
              menu: {
                title: 'general.menu.processes',
              },
            },
          },
          {
            path: 'create',
            data: {
              menu: {
                title: 'general.menu.processes_create',
              },
            },
          },
        ],
      },
    ],
  },
];
