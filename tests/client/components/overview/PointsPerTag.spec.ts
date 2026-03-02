import {shallowMount, VueWrapper} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import PointsPerTag from '@/client/components/overview/PointsPerTag.vue';

describe('PointsPerTag', () => {
  function doTest(points: any, expected: string) {
    const wrapper: VueWrapper<any> = shallowMount(PointsPerTag, {
      ...globalConfig,
      parentComponent: {
        methods: {
          getVisibilityState: () => {},
        },
      },
      props: {
        points: points,
      },
    });
    expect(wrapper.text()).eq(expected);
  }

  it('1 VP', () => {
    doTest({points: 1, halfPoints: 0}, '1');
  });

  it('1.5 VP', () => {
    doTest({points: 1.5, halfPoints: 0}, '1½');
  });

  it('1 1/3 VP', () => {
    doTest({points: 4/3, halfPoints: 0}, '1⅓');
  });

  it('half point special case 1', () => {
    doTest({points: 2, halfPoints: 1}, '2½');
  });

  it('half point special case 2', () => {
    doTest({points: 0, halfPoints: 2}, '2⁄2');
  });
});
