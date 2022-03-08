import {expect} from 'chai';
import {shallowMount, Wrapper} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import CardVictoryPoints from '@/client/components/card/CardVictoryPoints.vue';
import {ICardRenderDynamicVictoryPoints} from '@/common/cards/render/ICardRenderDynamicVictoryPoints';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {RecursivePartial} from '@/common/utils/utils';

describe('CardVictoryPoints', () => {
  let wrapper: Wrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(CardVictoryPoints, {
      localVue: getLocalVue(),
      propsData: {
        victoryPoints: 0,
      },
    });
  });
  it('straight points', async () => {
    await wrapper.setProps({
      victoryPoints: 2,
    });
    expect(wrapper.text()).to.eq('2');
    expect(wrapper.find('[data-test=item]').exists()).is.false;
  });
  it('renders ?', async () => {
    await wrapper.setProps(prop({}));
    expect(wrapper.text()).to.eq('?');
  });
  it('points without item', async () => {
    await wrapper.setProps(prop({
      points: 5,
      target: 5,
    }));
    expect(wrapper.text()).to.eq('5');
    expect(wrapper.find('[data-test=item]').exists()).is.false;
  });
  it('renders points with item - points = targed 10/', async () => {
    await wrapper.setProps(prop({item: {type: CardRenderItemType.CAMPS}, points: 10, target: 10}));
    expect(wrapper.text()).to.equal('10/');
    expect(wrapper.find('[data-test=item]').props().item.type).eq('camps');
  });
  it('renders points with item - points = targed 5/10', async () => {
    await wrapper.setProps(prop({item: {type: CardRenderItemType.ASTEROIDS}, points: 5, target: 10}));
    expect(wrapper.text()).to.equal('5/10');
    expect(wrapper.find('[data-test=item]').props().item.type).eq('asteroids');
  });
  it('search for life', async () => {
    await wrapper.setProps(prop({item: {type: CardRenderItemType.SCIENCE}, targetOneOrMore: true}));
    expect(wrapper.text()).to.equal('*:3');
    expect(wrapper.find('[data-test=item]').props().item.type).eq('science');
  });


  function prop(vps: RecursivePartial<ICardRenderDynamicVictoryPoints>) {
    return {
      victoryPoints: {
        item: undefined,
        points: 0,
        target: 0,
        targetOneOrMore: false,
        anyPlayer: false,
        ...vps,
      },
    };
  }
});
