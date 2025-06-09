import HomePage from '@/components/pages/HomePage';
import ArchivePage from '@/components/pages/ArchivePage';
// NotFoundPage is used directly in App.jsx now, not via routes config

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
label: 'Tasks',
    path: '/home',
    icon: 'CheckSquare',
    component: HomePage
  },
  archive: {
    id: 'archive',
label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: ArchivePage
  }
};

export const routeArray = Object.values(routes);