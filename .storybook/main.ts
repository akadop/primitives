import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../packages/core/**/*.stories.tsx', '../packages/react/**/*.stories.tsx'],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      builder: {},
      // enable React strict mode
      strictMode: true,
    },
  },

  swc: (config) => ({
    ...config,
    jsc: {
      ...config?.jsc,
      transform: {
        ...config?.jsc?.transform,
        react: {
          // Do not require importing React into scope to use JSX
          runtime: 'automatic',
        },
      },
    },
  }),

  // we need to add aliases to webpack so it knows how to follow
  // to the source of the packages rather than the built version (dist)
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        ...convertRadixPackagesToWebpackAliases(),
      },
    },
  }),
};

export default config;

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return path.dirname(require.resolve(path.join(value, 'package.json')));
}

function convertRadixPackagesToWebpackAliases() {
  const rootDir = path.resolve(__dirname, '../');
  const paths = Object.entries({
    // core packages
    '@radix-ui/number': ['./packages/core/number/src'],
    '@radix-ui/primitive': ['./packages/core/primitive/src'],
    '@radix-ui/rect': ['./packages/core/rect/src'],

    // react packages
    'radix-ui': ['./packages/react/radix-ui/src'],
    '@radix-ui/react-accessible-icon': ['./packages/react/accessible-icon/src'],
    '@radix-ui/react-accordion': ['./packages/react/accordion/src'],
    '@radix-ui/react-alert-dialog': ['./packages/react/alert-dialog/src'],
    '@radix-ui/react-announce': ['./packages/react/announce/src'],
    '@radix-ui/react-arrow': ['./packages/react/arrow/src'],
    '@radix-ui/react-aspect-ratio': ['./packages/react/aspect-ratio/src'],
    '@radix-ui/react-avatar': ['./packages/react/avatar/src'],
    '@radix-ui/react-checkbox': ['./packages/react/checkbox/src'],
    '@radix-ui/react-collapsible': ['./packages/react/collapsible/src'],
    '@radix-ui/react-collection': ['./packages/react/collection/src'],
    '@radix-ui/react-compose-refs': ['./packages/react/compose-refs/src'],
    '@radix-ui/react-context': ['./packages/react/context/src'],
    '@radix-ui/react-context-menu': ['./packages/react/context-menu/src'],
    '@radix-ui/react-dialog': ['./packages/react/dialog/src'],
    '@radix-ui/react-direction': ['./packages/react/direction/src'],
    '@radix-ui/react-dismissable-layer': ['./packages/react/dismissable-layer/src'],
    '@radix-ui/react-dropdown-menu': ['./packages/react/dropdown-menu/src'],
    '@radix-ui/react-focus-guards': ['./packages/react/focus-guards/src'],
    '@radix-ui/react-focus-scope': ['./packages/react/focus-scope/src'],
    '@radix-ui/react-form': ['./packages/react/form/src'],
    '@radix-ui/react-hover-card': ['./packages/react/hover-card/src'],
    '@radix-ui/react-id': ['./packages/react/id/src'],
    '@radix-ui/react-label': ['./packages/react/label/src'],
    '@radix-ui/react-menu': ['./packages/react/menu/src'],
    '@radix-ui/react-menubar': ['./packages/react/menubar/src'],
    '@radix-ui/react-navigation-menu': ['./packages/react/navigation-menu/src'],
    '@radix-ui/react-popover': ['./packages/react/popover/src'],
    '@radix-ui/react-popper': ['./packages/react/popper/src'],
    '@radix-ui/react-portal': ['./packages/react/portal/src'],
    '@radix-ui/react-presence': ['./packages/react/presence/src'],
    '@radix-ui/react-primitive': ['./packages/react/primitive/src'],
    '@radix-ui/react-progress': ['./packages/react/progress/src'],
    '@radix-ui/react-radio-group': ['./packages/react/radio-group/src'],
    '@radix-ui/react-roving-focus': ['./packages/react/roving-focus/src'],
    '@radix-ui/react-scroll-area': ['./packages/react/scroll-area/src'],
    '@radix-ui/react-select': ['./packages/react/select/src'],
    '@radix-ui/react-separator': ['./packages/react/separator/src'],
    '@radix-ui/react-slider': ['./packages/react/slider/src'],
    '@radix-ui/react-slot': ['./packages/react/slot/src'],
    '@radix-ui/react-switch': ['./packages/react/switch/src'],
    '@radix-ui/react-tabs': ['./packages/react/tabs/src'],
    '@radix-ui/react-toast': ['./packages/react/toast/src'],
    '@radix-ui/react-toggle': ['./packages/react/toggle/src'],
    '@radix-ui/react-toggle-group': ['./packages/react/toggle-group/src'],
    '@radix-ui/react-toolbar': ['./packages/react/toolbar/src'],
    '@radix-ui/react-tooltip': ['./packages/react/tooltip/src'],
    '@radix-ui/react-use-callback-ref': ['./packages/react/use-callback-ref/src'],
    '@radix-ui/react-use-controllable-state': ['./packages/react/use-controllable-state/src'],
    '@radix-ui/react-use-escape-keydown': ['./packages/react/use-escape-keydown/src'],
    '@radix-ui/react-use-layout-effect': ['./packages/react/use-layout-effect/src'],
    '@radix-ui/react-use-previous': ['./packages/react/use-previous/src'],
    '@radix-ui/react-use-rect': ['./packages/react/use-rect/src'],
    '@radix-ui/react-use-size': ['./packages/react/use-size/src'],
    '@radix-ui/react-visually-hidden': ['./packages/react/visually-hidden/src'],
  });

  return paths.reduce((aliases, [realPath, mappedPath]) => {
    aliases[realPath] = path.join(rootDir, mappedPath[0]);
    console.log(aliases[realPath]);
    return aliases;
  }, {});
}
