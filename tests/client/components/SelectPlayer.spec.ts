import {mount, Wrapper} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {Color} from '@/common/Color';
import SelectPlayer from '@/client/components/SelectPlayer.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';

describe('SelectPlayer', () => {
  let wrapper: Wrapper<any>;
  let response: Array<Array<string>> = [];

  const players: Array<Partial<PublicPlayerModel>> = [
    {name: 'alpha', color: Color.BLUE},
    {name: 'beta', color: Color.RED},
    {name: 'gamma', color: Color.YELLOW},
    {name: 'delta', color: Color.GREEN},
  ];

  beforeEach(() => {
    const playerInput: Partial<PlayerInputModel> = {
      title: '',
      buttonLabel: '',
      // This is a different order from the order in `players`
      // because this is the order that players will be shown.
      players: [Color.RED, Color.YELLOW, Color.GREEN, Color.BLUE],
    };

    wrapper = mount(SelectPlayer, {
      localVue: getLocalVue(),
      propsData: {
        players: players,
        playerinput: playerInput,
        onsave: (r: Array<Array<string>>) => {
          response = r;
        },
        showsave: true,
        showtitle: true,
      },
    });
  });

  it('content loaded', async () => {
    await wrapper.vm.$nextTick();

    const inputs = wrapper.findAll('input');
    expect(inputs.length).eq(4);
    expect(inputs.at(0).element.getAttribute('value')).eq('red');
    expect(inputs.at(1).element.getAttribute('value')).eq('yellow');
    expect(inputs.at(2).element.getAttribute('value')).eq('green');
    expect(inputs.at(3).element.getAttribute('value')).eq('blue');

    const spans = wrapper.findAll('span');
    expect(spans.at(0).element.textContent).eq('beta');
    expect(spans.at(1).element.textContent).eq('gamma');
    expect(spans.at(2).element.textContent).eq('delta');
    expect(spans.at(3).element.textContent).eq('alpha');
  });

  it('input selection', async () => {
    await wrapper.vm.$nextTick();

    const inputs = wrapper.findAll('input');
    clickInput(inputs.at(0));
    expect(wrapper.vm.$data.selectedPlayer).eq('red');
    clickButton();
    expect(response).deep.eq([['red']]);

    clickInput(inputs.at(1));
    expect(wrapper.vm.$data.selectedPlayer).eq('yellow');
    clickButton();
    expect(response).deep.eq([['yellow']]);

    clickInput(inputs.at(2));
    expect(wrapper.vm.$data.selectedPlayer).eq('green');
    clickButton();
    expect(response).deep.eq([['green']]);

    clickInput(inputs.at(3));
    expect(wrapper.vm.$data.selectedPlayer).eq('blue');
    clickButton();
    expect(response).deep.eq([['blue']]);
  });

  async function clickInput(input: Wrapper<any>) {
    const radio = input.element as HTMLInputElement;
    radio.checked = true;
    input.trigger('change');
    await wrapper.vm.$nextTick();
  }

  async function clickButton() {
    wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
  }
});
