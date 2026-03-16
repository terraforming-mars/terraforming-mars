import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import {fakeViewModel} from '../testHelpers';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {CardName} from '@/common/cards/CardName';

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

    const cardSpans = wrapper.findAll('.log-card');
    expect(cardSpans).to.have.length(1);
    expect(cardSpans[0].text()).to.equal('Ants');
  });

  it('renders CARDS type as multiple card spans', () => {
    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.CARDS, value: [CardName.ANTS, CardName.ECOLINE]},
    ]);
    const wrapper = shallowMount(LogMessageComponent, {
      ...globalConfig,
      props: {
        message,
        viewModel: fakeViewModel(),
      },
    });

    const cardSpans = wrapper.findAll('.log-card');
    expect(cardSpans).to.have.length(2);
    expect(cardSpans[0].text()).to.equal('Ants');
    expect(cardSpans[1].text()).to.equal('EcoLine');
  });
});
