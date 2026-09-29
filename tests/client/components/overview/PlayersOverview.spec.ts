import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import {fakeGameModel, fakePublicPlayerModel, fakeViewModel} from '../testHelpers';
import {Phase} from '@/common/Phase';

describe('PlayersOverview', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PlayersOverview, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      props: {
        playerView: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('labels the player deciding World Government Terraforming as active', () => {
    // #5187: the stale active player is not the one being waited on.
    const blue = fakePublicPlayerModel({color: 'blue', isActive: true});
    const red = fakePublicPlayerModel({color: 'red'});
    red.timer.running = true;
    const wrapper = shallowMount(PlayersOverview, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      props: {
        playerView: fakeViewModel({
          game: fakeGameModel({phase: Phase.SOLAR}),
          players: [blue, red],
          thisPlayer: blue,
        }),
      },
    });
    const vm = wrapper.vm as any;
    expect(vm.getActionLabel(blue)).eq('none');
    expect(vm.getActionLabel(red)).eq('active');
  });

  it('keeps normal labels during a temporary Solar phase', () => {
    // World Government Advisor and Terra switch to the Solar phase during the active player's turn.
    const blue = fakePublicPlayerModel({color: 'blue', isActive: true});
    blue.timer.running = true;
    const red = fakePublicPlayerModel({color: 'red'});
    const wrapper = shallowMount(PlayersOverview, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => true,
          setVisibilityState: () => {},
        },
      } as any,
      props: {
        playerView: fakeViewModel({
          game: fakeGameModel({phase: Phase.SOLAR, passedPlayers: ['red']}),
          players: [blue, red],
          thisPlayer: blue,
        }),
      },
    });
    const vm = wrapper.vm as any;
    expect(vm.getActionLabel(blue)).eq('active');
    expect(vm.getActionLabel(red)).eq('passed');
  });
});
