import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import GameOptionsPopup from '@/client/components/GameOptionsPopup.vue';
import {fakeGameOptionsModel} from './testHelpers';
import {CardName} from '@/common/cards/CardName';

describe('GameOptionsPopup', () => {
  it('renders the game options as markdown', () => {
    const gameOptions = fakeGameOptionsModel({
      bannedCards: [CardName.ALGAE, CardName.BIRDS],
      escapeVelocity: {thresholdMinutes: 30, bonusSectionsPerAction: 2, penaltyPeriodMinutes: 2, penaltyVPPerPeriod: 1},
    });
    const wrapper = mount(GameOptionsPopup, {
      ...globalConfig,
      props: {gameOptions},
    });
    const lines = wrapper.find('.game-options-markdown').text().split('\n');
    expect(lines).to.include('- boardName: tharsis');
    expect(lines).to.include('- bannedCards: Algae, Birds');
    expect(lines).to.include('- includedCards: none');
    expect(lines).to.include('- expansions:');
    expect(lines).to.include('  - corpera: true');
    expect(lines).to.include('- escapeVelocity:');
    expect(lines).to.include('  - thresholdMinutes: 30');
  });
  it('captures key presses while showing', () => {
    let reached = false;
    const listener = () => reached = true;
    window.addEventListener('keydown', listener);
    const wrapper = mount(GameOptionsPopup, {
      ...globalConfig,
      props: {gameOptions: fakeGameOptionsModel()},
    });

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));
    expect(reached).to.be.false;
    expect(wrapper.emitted('close')).to.be.undefined;

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(reached).to.be.false;
    expect(wrapper.emitted('close')).to.have.length(1);

    wrapper.unmount();
    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));
    expect(reached).to.be.true;
    window.removeEventListener('keydown', listener);
  });
});
