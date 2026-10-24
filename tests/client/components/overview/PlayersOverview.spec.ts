import {mount, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {defineComponent, h, PropType, withDirectives} from 'vue';
import {globalConfig} from '../getLocalVue';
import PlayersOverview from '@/client/components/overview/PlayersOverview.vue';
import {trimEmptyTextNodes} from '@/client/directives/TrimWhitespace';
import {fakeGameModel, fakePublicPlayerModel, fakeViewModel} from '../testHelpers';
import {Phase} from '@/common/Phase';
import {PublicPlayerModel, ViewModel} from '@/common/models/PlayerModel';

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

  it('reorders players under v-trim-whitespace', async () => {
    // A spectator's players start with the first player, so they rotate every generation.
    const spectator = (players: Array<PublicPlayerModel>) => fakeViewModel({players, thisPlayer: undefined, color: 'neutral'});
    const blue = fakePublicPlayerModel({color: 'blue'});
    const red = fakePublicPlayerModel({color: 'red'});
    const Host = defineComponent({
      props: {playerView: {type: Object as PropType<ViewModel>, required: true}},
      render() {
        const directive = {mounted: trimEmptyTextNodes, updated: trimEmptyTextNodes};
        return withDirectives(h(PlayersOverview, {playerView: this.playerView}), [[directive]]);
      },
    });
    const errors: Array<unknown> = [];
    const wrapper = mount(Host, {
      global: {
        ...globalConfig.global,
        stubs: {PlayerInfo: true, OtherPlayer: true, OverviewSettings: true},
        config: {...globalConfig.global.config, errorHandler: (err) => errors.push(err)},
      },
      props: {playerView: spectator([blue, red])},
    });

    await wrapper.setProps({playerView: spectator([red, blue])});

    expect(errors).deep.eq([]);
  });
});
