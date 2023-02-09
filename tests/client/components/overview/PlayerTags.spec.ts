import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {Color} from '@/common/Color';
import PlayerTags from '@/client/components/overview/PlayerTags.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {RecursivePartial} from '@/common/utils/utils';
import {Tag} from '@/common/cards/Tag';
import {Wrapper} from '@vue/test-utils';

describe('PlayerTags', function() {
  let wrapper: Wrapper<PlayerTags>;

  beforeEach(() => {
    const player: RecursivePartial<PublicPlayerModel> = {
      color: Color.BLUE,
      tableau: [
        {
          name: CardName.CRESCENT_RESEARCH_ASSOCIATION, // 1/3 VP per moon tag
        },
        {
          name: CardName.ACQUIRED_COMPANY,
          discount: [{tag: Tag.MICROBE, amount: 1}],
        },
        {
          name: CardName.BACTOVIRAL_RESEARCH,
          discount: [{tag: Tag.VENUS, amount: 1}, {tag: Tag.MICROBE, amount: 2}],
        },
        {
          name: CardName.MOON_TETHER,
          discount: [{tag: undefined, amount: 4}],
        },
        {
          // 1/2 VP per Venus tag
          name: CardName.CULTIVATION_OF_VENUS,
        },
        {
          // 1 VP per Moon tag
          name: CardName.LUNA_SENATE,
        },
      ],
      tags: [],
      victoryPointsBreakdown: {
        total: 1,
      },
    };
    const playerView: RecursivePartial<PlayerViewModel> = {
      thisPlayer: player,
      id: 'playerid-foo',
      game: {
        gameOptions: {
          showTimers: false,
        },
      },
      players: [player],
    };
    wrapper = shallowMount(PlayerTags, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: function() {},
        },
      },
      propsData: {
        player: player,
        playerView: playerView,
        hideZeroTags: false,
        conciseTagsViewDefaultValue: false,
      },
    });
    // For tests.
    wrapper.vm.$data.conciseView = false;
  });

  it('tag discounts', function() {
    const test = function(tag: Tag | 'all', value: number) {
      const elem = wrapper.find(`[data-test="discount-${tag}"]`);
      expect(elem.attributes()['amount']).to.eq(`${value}`);
    };
    test(Tag.MICROBE, 3);
    test(Tag.VENUS, 1);
    expect(() => test(Tag.EARTH, 0)).to.throw(/find did not return/);
    test('all', 4);
  });

  it('victoryPoints', function() {
    const test = function(tag: Tag | 'all', value: string) {
      const elem = wrapper.find(`[data-test="vps-${tag}"]`);
      expect(elem.attributes()['amount']).to.eq(value);
    };
    // expect(() => test(Tag.JOVIAN, '')).to.throw(/find did not return/);
    // Victory Points come from the cards themselves, and not the props.
    test(Tag.VENUS, '½');
    test(Tag.MOON, '1⅓');
  });
});
