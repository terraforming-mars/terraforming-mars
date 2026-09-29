import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ValidationErrorsPopup from '@/client/components/create/ValidationErrorsPopup.vue';
import {ValidationErrors} from '@/common/game/validateNewGameConfig';
import {CardName} from '@/common/cards/CardName';
import {WIKI_URLS} from '@/client/utils/WikiLinks';

const NO_ERRORS: ValidationErrors = {
  negativeEscapeVelocity: false,
  notEnoughColonies: 0,
  notEnoughCeos: 0,
  notEnoughPreludes: 0,
  maybeNotEnoughPreludes: [],
  coloniesMissingExpansions: [],
  corporationsMissingExpansions: [],
  preludesMissingExpansions: [],
  ceosMissingExpansions: [],
  soloWithoutCorporateEra: false,
  infiniteEnergyBug: false,
  notEnoughCorporations: 0,
};

describe('ValidationErrorsPopup', () => {
  it('lists errors and warnings', () => {
    const wrapper = mount(ValidationErrorsPopup, {
      ...globalConfig,
      props: {errors: {...NO_ERRORS, notEnoughCorporations: 4, corporationsMissingExpansions: [CardName.ECOLINE]}},
    });
    const text = wrapper.text();
    expect(text).to.include('Must select at least 4 corporations');
    expect(text).to.include('Some of the corps you selected need expansions you have not enabled.');
    expect(text).to.include(CardName.ECOLINE);
    expect(text).to.not.include('Escape Velocity');
    expect(wrapper.find('a').exists()).is.false;
  });

  it('links to the wiki for more details', () => {
    const wrapper = mount(ValidationErrorsPopup, {
      ...globalConfig,
      props: {errors: {...NO_ERRORS, maybeNotEnoughPreludes: [CardName.VALLEY_TRUST]}},
    });
    const link = wrapper.find('a');
    expect(link.text()).eq('Learn more');
    expect(link.attributes('href')).eq(WIKI_URLS.customPreludes);
  });
});
