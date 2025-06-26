import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import PlayerTags from '@/client/components/overview/PlayerTags.vue';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {RecursivePartial} from '@/common/utils/utils';
import {Tag} from '@/common/cards/Tag';
import {Wrapper} from '@vue/test-utils';

describe('PlayerTags', () => {
  let wrapper: Wrapper<PlayerTags>;

  beforeEach(() => {
    const player: RecursivePartial<PublicPlayerModel> = {
      color: 'blue',
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
      tags: {
        [Tag.BUILDING]: 0,
        [Tag.SPACE]: 0,
        [Tag.SCIENCE]: 0,
        [Tag.POWER]: 0,
        [Tag.EARTH]: 0,
        [Tag.JOVIAN]: 0,
        [Tag.VENUS]: 0,
        [Tag.PLANT]: 0,
        [Tag.MICROBE]: 0,
        [Tag.ANIMAL]: 0,
        [Tag.CITY]: 0,
        [Tag.EVENT]: 0,
      },
      victoryPointsBreakdown: {
        total: 1,
      },
      terraformRating: 100,
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
        tags: [
          Tag.BUILDING,
          Tag.SPACE,
          Tag.SCIENCE,
          Tag.POWER,
          Tag.EARTH,
          Tag.JOVIAN,
          Tag.VENUS,
          Tag.PLANT,
          Tag.MICROBE,
          Tag.ANIMAL,
          Tag.CITY,
          Tag.EVENT,
        ],
      },
      players: [player],
    };
    wrapper = shallowMount(PlayerTags, {
      localVue: getLocalVue(),
      parentComponent: {
        methods: {
          getVisibilityState: () => {},
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
