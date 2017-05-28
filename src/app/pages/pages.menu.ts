export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: true,
            expanded: true,
            order: 0,
          },
        },
      },
      {
        path: 'chains',
        data: {
          menu: {
            title: 'general.menu.chains',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 1,
          },
        },
        children: [
          {
            path: 'list',
            data: {
              menu: {
                title: 'general.menu.chains_list',
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
        path: 'maps',
        data: {
          menu: {
            title: 'general.menu.maps',
            icon: 'ion-ios-location-outline',
            selected: false,
            expanded: false,
            order: 600,
          },
        },
        children: [
          {
            path: 'leafletmaps',
            data: {
              menu: {
                title: 'general.menu.leaflet_maps',
              },
            },
          },
        ],
      },
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.pages',
            icon: 'ion-document',
            selected: false,
            expanded: false,
            order: 650,
          },
        },
        children: [
          {
            path: ['/login'],
            data: {
              menu: {
                title: 'general.menu.login',
              },
            },
          },
          {
            path: ['/register'],
            data: {
              menu: {
                title: 'general.menu.register',
              },
            },
          },
        ],
      },
    ],
  },
];
