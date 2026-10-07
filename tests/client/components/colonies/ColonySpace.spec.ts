import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ColonySpace from '@/client/components/colonies/ColonySpace.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColonyOrThrow} from '@/client/colonies/ClientColonyManifest';

describe('ColonySpace', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColonySpace, {
      ...globalConfig,
      props: {
        idx: 0,
        metadata: getColonyOrThrow(ColonyName.GANYMEDE),
        player: undefined,
        marker: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('fades the marker only over a build bonus', () => {
    const mount = (idx: number, fadeMarker: boolean) => shallowMount(ColonySpace, {
      ...globalConfig,
      props: {
        idx,
        metadata: getColonyOrThrow(ColonyName.GANYMEDE),
        player: undefined,
        marker: true,
        fadeMarker,
      },
    });
    expect(mount(2, false).find('.colony-track-marker--fading').exists()).is.false;
    expect(mount(2, true).find('.colony-track-marker--fading').exists()).is.true;
    expect(mount(3, true).find('.colony-track-marker--fading').exists()).is.false;
  });
});
