import i18nPlugin from '@/client/plugins/i18n.plugin';

export const globalConfig = {
  global: {
    plugins: [i18nPlugin],
    directives: {
      'trim-whitespace': {},
    },
  },
};
