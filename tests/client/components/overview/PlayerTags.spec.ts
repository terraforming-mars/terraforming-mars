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
      tags: {},
      victoryPointsBreakdown: {
        total: 1,
      },
    };
    const playerView: RecursivePartial<PlayerViewModel> = {
      thisPlayer: player,
      id: 'playerid-foo',
      game: {
        gameOptions: {
          expansions: {
            corpera: true,
            promo: false,
            venus: true,
            colonies: false,
            prelude: false,
            prelude2: false,
            turmoil: false,
            community: false,
            ares: false,
            moon: false,
            pathfinders: false,
            ceo: false,
            starwars: false,
            underworld: false,
          },
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

  function elem(tag: Tag | 'all'): any {
    const newLocal: Wrapper<any> = wrapper.find(`[data-test="discount-${tag}"]`);
    return newLocal;
  }

  function amount(e: Wrapper<any>): string {
    return e.attributes()['amount'];
  }

  it('tag discounts - microbe', () => {
    expect(amount(elem(Tag.MICROBE))).to.eq('3');
  });

  it('tag discounts - venus', () => {
    expect(amount(elem(Tag.VENUS))).to.eq('1');
  });

  it('tag discounts - all', () => {
    expect(amount(elem('all'))).to.eq('4');
  });

  it('tag discounts - earth', () => {
    expect(elem(Tag.EARTH).exists()).to.eq(false);
  });
});
