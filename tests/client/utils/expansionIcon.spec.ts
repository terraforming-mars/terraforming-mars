import {expect} from 'chai';
import {expansionIconClass} from '@/client/utils/expansionIcon';

describe('expansionIcon', () => {
  it('uses the module name for most modules', () => {
    expect(expansionIconClass('base')).eq('expansion-icon-base');
    expect(expansionIconClass('venus')).eq('expansion-icon-venus');
    expect(expansionIconClass('deltaProject')).eq('expansion-icon-deltaProject');
  });

  it('uses the icon name for modules whose icons are named differently', () => {
    expect(expansionIconClass('corpera')).eq('expansion-icon-CE');
    expect(expansionIconClass('colonies')).eq('expansion-icon-colony');
    expect(expansionIconClass('moon')).eq('expansion-icon-themoon');
  });
});
