import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import SelectHowToPay from '@/client/components/SelectHowToPay.vue';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {PaymentTester} from './PaymentTester';

describe('SelectHowToPay', () => {
  it('select how to pay uses heat', async () => {
    const wrapper = setupBill(
      10,
      {heat: 5, megaCredits: 7},
      {canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('heat', 3);
    tester.expectValue('megaCredits', 7);

    await tester.clickMax('heat');

    tester.expectValue('heat', 5);
    tester.expectValue('megaCredits', 5);

    await tester.clickMinus('heat');

    tester.expectValue('heat', 4);
    tester.expectValue('megaCredits', 6);

    await tester.clickMinus('heat');

    tester.expectValue('heat', 3);
    tester.expectValue('megaCredits', 7);

    await tester.clickPlus('heat');

    tester.expectValue('heat', 4);
    tester.expectValue('megaCredits', 6);
  });

  it('select how to pay uses steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('steel', 4);
    tester.expectValue('megaCredits', 2);
  });

  it('select how to pay uses titanium metal bonus', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('titanium', 2);
    tester.expectValue('megaCredits', 0);
  });

  const setupBill = function(
    amount: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<PlayerInputModel>) {
    const thisPlayer: Partial<PublicPlayerModel> = Object.assign({
      steel: 0,
      titanium: 0,
      heat: 0,
      steelValue: 2,
      titaniumValue: 3,
    }, playerFields);
    const playerView: Partial<PlayerViewModel> = {
      thisPlayer: thisPlayer as PublicPlayerModel,
      id: 'foo',
    };

    const playerInput: Partial<PlayerInputModel> = Object.assign({
      amount: amount,
      title: 'foo',
      microbes: 0,
      floaters: 0,
      science: 0,
    }, playerInputFields);

    return mount(SelectHowToPay, {
      localVue: getLocalVue(),
      propsData: {
        playerView: playerView,
        playerinput: playerInput,
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
  };
});
