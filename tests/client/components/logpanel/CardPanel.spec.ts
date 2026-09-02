import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';

describe('CardPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardPanel, {
      ...globalConfig,
      props: {
        message: new LogMessage(LogMessageType.DEFAULT, '', []),
        players: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
