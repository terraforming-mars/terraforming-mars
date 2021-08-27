// import {createLocalVue, mount} from '@vue/test-utils';

// import {expect} from 'chai';
// import PlayerStatus from '../../../src/components/overview/PlayerStatus.vue';

// describe('PlayerStatus', function() {
//   function getLocalVue() {
//     const localVue = createLocalVue();
//     localVue.directive('i18n', {});
//     return localVue;
//   }
//   it('includes corporation cards with played card count', function() {
//     const playerStatus = mount(PlayerStatus, {
//       localVue: getLocalVue(),
//       parentComponent: {
//         methods: {
//           getVisibilityState: function() {},
//         },
//       },
//       propsData: {
//         player: {
//           corporationCard: {},
//           id: 'foobar',
//           playedCards: [],
//           gameOptions: {
//             showTimers: false,
//           },
//         },
//       },
//     });
//     const test = playerStatus.find('div[class*="played-cards-count"]');
//     expect(test.text()).to.eq('1');
//   });
// });
