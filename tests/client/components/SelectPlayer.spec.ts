import {mount, Wrapper} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import SelectPlayer from '@/client/components/SelectPlayer.vue';
import {SelectPlayerModel} from '@/common/models/PlayerInputModel';
import {PublicPlayerModel} from '@/common/models/PlayerModel';
import {InputResponse} from '@/common/inputs/InputResponse';

describe('SelectPlayer', () => {
  let wrapper: Wrapper<any>;
  let response: InputResponse | undefined = undefined;

  const players: Array<Partial<PublicPlayerModel>> = [
    {name: 'alpha', color: 'blue'},
    {name: 'beta', color: 'red'},
    {name: 'gamma', color: 'yellow'},
    {name: 'delta', color: 'green'},
  ];

  beforeEach(() => {
    const playerInput: SelectPlayerModel = {
      type: 'player',
      title: '',
      buttonLabel: '',
      // This is a different order from the order in `players`
      // because this is the order that players will be shown.
      players: ['red', 'yellow', 'green', 'blue'],
    };

    wrapper = mount(SelectPlayer, {
      localVue: getLocalVue(),
      propsData: {
        players: players,
        playerinput: playerInput,
        onsave: (r: InputResponse) => {
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
    expect(inputs).has.length(4);
    expect(inputs[0].element.getAttribute('value')).eq('red');
    expect(inputs[1].element.getAttribute('value')).eq('yellow');
    expect(inputs[2].element.getAttribute('value')).eq('green');
    expect(inputs[3].element.getAttribute('value')).eq('blue');

    const spans = wrapper.findAll('span');
    expect(spans[0].element.textContent).eq('beta');
    expect(spans[1].element.textContent).eq('gamma');
    expect(spans[2].element.textContent).eq('delta');
    expect(spans[3].element.textContent).eq('alpha');
  });

  it('input selection', async () => {
    await wrapper.vm.$nextTick();

    const inputs = wrapper.findAll('input');
    clickInput(inputs[0]);
    expect(wrapper.vm.$data.selectedPlayer).eq('red');
    clickButton();
    expect(response).deep.eq({type: 'player', player: 'red'});

    clickInput(inputs[1]);
    expect(wrapper.vm.$data.selectedPlayer).eq('yellow');
    clickButton();
    expect(response).deep.eq({type: 'player', player: 'yellow'});

    clickInput(inputs[2]);
    expect(wrapper.vm.$data.selectedPlayer).eq('green');
    clickButton();
    expect(response).deep.eq({type: 'player', player: 'green'});

    clickInput(inputs[3]);
    expect(wrapper.vm.$data.selectedPlayer).eq('blue');
    clickButton();
    expect(response).deep.eq({type: 'player', player: 'blue'});
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
