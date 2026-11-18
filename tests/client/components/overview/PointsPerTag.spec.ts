import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import PointsPerTag from '@/client/components/overview/PointsPerTag.vue';

describe('PointsPerTag', () => {
  for (const run of [
    {title: '1 VP', points: {points: 1, halfPoints: 0}, expected: '1'},
    {title: '1.5 VP', points: {points: 1.5, halfPoints: 0}, expected: '1½'},
    {title: '1 1/3 VP', points: {points: 4/3, halfPoints: 0}, expected: '1⅓'},
    {title: 'half point special case 1', points: {points: 2, halfPoints: 1}, expected: '2½'},
    {title: 'half point special case 2', points: {points: 0, halfPoints: 2}, expected: '2⁄2'},
    {title: 'asterisk', points: {points: 1, halfPoints: 0, asterisk: true}, expected: '1*'},
    {title: 'asterisk - half point special case 2', points: {points: 0, halfPoints: 2, asterisk: true}, expected: '2⁄2*'},
  ] as const) {
    it(run.title, () => {
      const wrapper = shallowMount(PointsPerTag, {
        ...globalConfig,
        parentComponent: {
          methods: {
            getVisibilityState: () => {},
          },
        },
        props: {
          points: run.points,
        },
      });
      expect(wrapper.text()).eq(run.expected);
    });
  }
});
