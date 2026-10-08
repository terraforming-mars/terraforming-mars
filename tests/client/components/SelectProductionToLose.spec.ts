import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectProductionToLose from '@/client/components/SelectProductionToLose.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {SelectProductionToLoseResponse} from '@/common/inputs/InputResponse';

function mountComponent(units: Units, cost: number = 2, onsave: (out: SelectProductionToLoseResponse) => void = () => {}) {
  return shallowMount(SelectProductionToLose, {
    ...globalConfig,
    props: {
      playerView: {} as PlayerViewModel,
      playerinput: {
        title: 'Select production to lose',
        buttonLabel: 'Save',
        type: 'productionToLose',
        payProduction: {
          cost,
          units,
        },
      },
      onsave,
      showsave: true,
      showtitle: true,
    },
  });
}

describe('SelectProductionToLose', () => {
  it('mounts without errors', () => {
    const wrapper = mountComponent({...Units.EMPTY});
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('.payments_title').exists()).is.false;
  });

  it('only shows rows for production that can be lowered', () => {
    const wrapper = mountComponent(Units.of({megacredits: -5, steel: 1, plants: 2, heat: 1}));
    const icons = wrapper.findAll('.payments_type .production').map((w) => w.classes());
    expect(icons).to.have.length(3);
    expect(icons[0]).to.include('steel');
    expect(icons[1]).to.include('plant');
    expect(icons[2]).to.include('heat');
  });

  it('shows megacredits row when above the minimum', () => {
    const wrapper = mountComponent(Units.of({megacredits: -4}));
    const icons = wrapper.findAll('.payments_type .production');
    expect(icons).to.have.length(1);
    expect(icons[0].classes()).to.include('resource_icon--megacredits');
  });

  it('plus and minus are clamped to available production', async () => {
    const wrapper = mountComponent(Units.of({megacredits: -3, energy: 1}));
    const rows = wrapper.findAll('.payments_type');
    expect(rows).to.have.length(2);
    const [mcRow, energyRow] = rows;

    const mcPlus = mcRow.findAll('button')[1];
    const mcMinus = mcRow.findAll('button')[0];
    await mcPlus.trigger('click');
    await mcPlus.trigger('click');
    await mcPlus.trigger('click');
    expect((mcRow.find('input').element as HTMLInputElement).value).eq('2');
    await mcMinus.trigger('click');
    await mcMinus.trigger('click');
    await mcMinus.trigger('click');
    expect((mcRow.find('input').element as HTMLInputElement).value).eq('0');

    const energyPlus = energyRow.findAll('button')[1];
    await energyPlus.trigger('click');
    await energyPlus.trigger('click');
    expect((energyRow.find('input').element as HTMLInputElement).value).eq('1');
  });

  it('warns when the total is wrong', async () => {
    let saved: SelectProductionToLoseResponse | undefined;
    const wrapper = mountComponent(Units.of({megacredits: -5, steel: 2}), 2, (out) => saved = out);
    await wrapper.find('.payments_type').findAll('button')[1].trigger('click');
    await wrapper.find('.btn-submit').trigger('click');
    expect(saved).is.undefined;
    expect(wrapper.find('.tm-warning').exists()).is.true;
  });

  it('saves when the total is right', async () => {
    let saved: SelectProductionToLoseResponse | undefined;
    const wrapper = mountComponent(Units.of({megacredits: -5, steel: 1, heat: 1}), 2, (out) => saved = out);
    for (const row of wrapper.findAll('.payments_type')) {
      await row.findAll('button')[1].trigger('click');
    }
    await wrapper.find('.btn-submit').trigger('click');
    expect(wrapper.find('.tm-warning').exists()).is.false;
    expect(saved).deep.eq({type: 'productionToLose', units: Units.of({steel: 1, heat: 1})});
  });
});
