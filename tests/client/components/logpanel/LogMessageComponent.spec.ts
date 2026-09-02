import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import {fakeViewModel} from '../testHelpers';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {CardName} from '@/common/cards/CardName';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('LogMessageComponent', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message: new LogMessage(LogMessageType.DEFAULT, 'Test message', []),
        viewModel: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('renders CARD type as a single card span', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARD, value: CardName.ANTS},
    ]);
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardContainer.innerHTML).to.equal(
      '<span class="log-card background-color-active">Ants</span>',
    );
  });

  it('renders CARDS type as multiple card spans with locale-correct separator in English', () => {
    const message = new LogMessage(
      LogMessageType.DEFAULT,
      '${0}',
      [{type: LogMessageDataType.CARDS, value: [CardName.ALGAE, CardName.BIRDS, CardName.CELESTIC]}]);

    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {message, viewModel: fakeViewModel()},
    });

    const cardsContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardsContainer.innerHTML).to.equal(
      '<span class="log-card background-color-automated">Algae</span>' +
      ', ' +
      '<span class="log-card background-color-active">Birds</span>' +
      ', and ' +
      '<span class="log-card background-color-corporation">Celestic</span>',
    );
  });

  it('renders CARDS type as multiple card spans', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARDS, value: [CardName.ANTS, CardName.ECOLINE, CardName.BIRDS]},
    ]);
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardsContainer = wrapper.find('.log-card').element.parentElement!;
    expect(cardsContainer.innerHTML).to.equal(
      '<span class="log-card background-color-active">Ants</span>' +
      ', ' +
      '<span class="log-card background-color-corporation">Ecoline</span>' +
      ', and ' +
      '<span class="log-card background-color-active">Birds</span>',
    );
  });

  it('renders CARDS with locale-correct separator for French (fr)', () => {
    PreferencesManager.INSTANCE.set('lang', 'fr');
    try {
      const message = new LogMessage(
        LogMessageType.DEFAULT,
        '${0}',
        [{type: LogMessageDataType.CARDS, value: [CardName.ALGAE, CardName.BIRDS, CardName.CELESTIC]}]);
      const wrapper = shallowMount(LogMessageComponent, {
        ...globalConfig,
        props: {message, viewModel: fakeViewModel()},
      });
      // French conjunction list format: "A, B et C" (no Oxford comma)
      const cardsContainer = wrapper.find('.log-card').element.parentElement!;
      expect(cardsContainer.innerHTML).to.equal(
        '<span class="log-card background-color-automated">Algae</span>' +
        ', ' +
        '<span class="log-card background-color-active">Birds</span>' +
        ' et ' +
        '<span class="log-card background-color-corporation">Celestic</span>',
      );
    } finally {
      PreferencesManager.resetForTest();
    }
  });

  it('renders CARDS with locale-correct separator for Japanese (jp)', () => {
    PreferencesManager.INSTANCE.set('lang', 'jp');
    try {
      const message = new LogMessage(
        LogMessageType.DEFAULT,
        '${0}',
        [{type: LogMessageDataType.CARDS, value: [CardName.ALGAE, CardName.BIRDS, CardName.CELESTIC]}]);
      const wrapper = shallowMount(LogMessageComponent, {
        ...globalConfig,
        props: {message, viewModel: fakeViewModel()},
      });
      // Japanese conjunction list format: "A、B、C" (Japanese comma separator)
      const cardsContainer = wrapper.find('.log-card').element.parentElement!;
      expect(cardsContainer.innerHTML).to.equal(
        '<span class="log-card background-color-automated">Algae</span>' +
        '、' +
        '<span class="log-card background-color-active">Birds</span>' +
        '、' +
        '<span class="log-card background-color-corporation">Celestic</span>',
      );
    } finally {
      PreferencesManager.resetForTest();
    }
  });
});
