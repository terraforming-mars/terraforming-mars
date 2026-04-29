import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import PaymentForm from '@/client/components/PaymentForm.vue';
import {Ledger, newDefaultLedger} from '@/client/components/PaymentLedger';
import {SpendableResource} from '@/common/inputs/Spendable';

function mountPaymentForm(overrides: {
  cost: number,
  order?: ReadonlyArray<SpendableResource>,
  ledger?: Partial<Ledger>,
  showsave?: boolean,
}) {
  const order = overrides.order ?? ['megacredits'];
  const ledger = overrides.ledger ?? {};
  const props = {
    cost: overrides.cost,
    order,
    ledger: {...newDefaultLedger(), ...ledger},
    showsave: overrides.showsave ?? true,
    buttonLabel: 'Save',
  };

  return mount(PaymentForm, {
    ...globalConfig,
    props,
  });
}

describe('PaymentForm', () => {
  it('renders only units in spendableResources', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['heat', 'megacredits'],
      ledger: {
        'heat': {available: 1, value: 1},
        'megacredits': {available: 1, value: 1},
      },
    });

    expect(wrapper.find('[data-test=heat] input').exists()).is.true;
    expect(wrapper.find('[data-test=megacredits] input').exists()).is.true;
    expect(wrapper.find('[data-test=steel] input').exists()).is.false;
  });

  it('renders no units when spendableResources is empty', async () => {
    const wrapper = mountPaymentForm({cost: 0, order: []});

    expect(wrapper.find('[data-test=heat] input').exists()).is.false;
    expect(wrapper.find('[data-test=megacredits] input').exists()).is.false;
  });

  it('shows reserve warning when showReserveWarning returns true', async () => {
    const wrapper = mountPaymentForm({
      cost: 1,
      order: ['heat', 'megacredits'],
      ledger: {
        'heat': {available: 1, value: 1, reserved: true},
        'megacredits': {available: 1, value: 1},
      },
    });

    expect(wrapper.findAll('.card-warning')).has.length(1);
  });

  it('shows save button when showsave is true', async () => {
    const wrapper = mountPaymentForm({cost: 1, showsave: true});

    expect(wrapper.find('[data-test=save]').exists()).is.true;
  });

  it('hides save button when showsave is false', async () => {
    const wrapper = mountPaymentForm({cost: 1, showsave: false});

    expect(wrapper.find('[data-test=save]').exists()).is.false;
  });

  it('emits save when save button clicked and payment is valid', async () => {
    const wrapper = mountPaymentForm({
      cost: 0,
    });

    await wrapper.find('[data-test=save]').trigger('click');
    expect(wrapper.emitted('save')).to.exist;
  });

  it('plus increases the clicked unit and decreases megacredits', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['heat', 'megacredits'],
      ledger: {
        'heat': {available: 5, value: 1},
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=megacredits] input').setValue(8);
    await wrapper.find('[data-test=heat] input').setValue(2);
    await wrapper.find('[data-test=heat] .btn-plus').trigger('click');
    await wrapper.vm.$nextTick();

    const lp = wrapper.vm.localPayment;
    expect(lp.heat).eq(3);
    expect(lp.megacredits).eq(7);
  });

  it('minus decreases the clicked unit and increases megacredits', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['heat', 'megacredits'],
      ledger: {
        'heat': {available: 5, value: 1},
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=megacredits] input').setValue(8);
    await wrapper.find('[data-test=heat] input').setValue(2);
    await wrapper.find('[data-test=heat] .btn-minus').trigger('click');
    await wrapper.vm.$nextTick();

    const lp = wrapper.vm.localPayment;
    expect(lp.heat).eq(1);
    expect(lp.megacredits).eq(9);
  });

  it('max caps at floor(cost / rate) not at available units', async () => {
    // Steel worth 2 MC each; cost is 10; floor(10/2) = 5 max steel regardless of 20 available
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['steel', 'megacredits'],
      ledger: {
        'steel': {available: 20, value: 2},
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=steel] .btn-max').trigger('click');
    await wrapper.vm.$nextTick();

    const lp = wrapper.vm.localPayment;
    expect(lp.steel).eq(5);
    expect(lp.megacredits).eq(0);
  });

  it('max respects getResourceRate when computing how many units to use', async () => {
    // Titanium worth 3 MC each; cost is 11; floor(11/3) = 3 titanium, leaving 2 MC
    const wrapper = mountPaymentForm({
      cost: 11,
      order: ['titanium', 'megacredits'],
      ledger: {
        'titanium': {available: 10, value: 3},
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=titanium] .btn-max').trigger('click');
    await wrapper.vm.$nextTick();

    const lp = wrapper.vm.localPayment;
    expect(lp.titanium).eq(3);
    expect(lp.megacredits).eq(2);
  });

  it('megacredits never go below zero', async () => {
    // heat fills the entire cost; MC floors at 0
    const wrapper = mountPaymentForm({
      cost: 8,
      order: ['heat', 'megacredits'],
      ledger: {
        'heat': {available: 20, value: 1},
        'megacredits': {available: 5, value: 1},
      },
    });

    await wrapper.find('[data-test=heat] .btn-max').trigger('click');
    await wrapper.vm.$nextTick();

    const lp = wrapper.vm.localPayment;
    expect(lp.heat).eq(8);
    expect(lp.megacredits).eq(0);
  });

  it('computes greedy defaults when initialPayment is omitted', async () => {
    // cost=10, steel rate=2 available=3, megacredits available=5
    // greedy: ceil(max(10-5,0)/2)=3 steel (6 MC), then MC=min(5,max(10-6,0))=4
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['steel', 'megacredits'],
      ledger: {
        'steel': {available: 3, value: 2},
        'megacredits': {available: 5, value: 1},
      },
    });

    const lp = wrapper.vm.localPayment;
    expect(lp.steel).eq(3);
    expect(lp.megacredits).eq(4);
  });

  it('megacredits max sets megacredits to min(available, cost)', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['megacredits'],
      ledger: {
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=megacredits] .btn-max').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.localPayment.megacredits).eq(10);
  });

  it('megacredits max recalculates other resources to avoid overspend', async () => {
    // cost=10, MC=8, steel=5 at rate 2
    // Greedy initial: steel=5 covers all, MC=0
    // After max MC (MC=8): post-pass reduces steel to 1 (8+2=10 exact)
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['steel', 'megacredits'],
      ledger: {
        'steel': {available: 5, value: 2},
        'megacredits': {available: 8, value: 1},
      },
    });

    const lp = wrapper.vm.localPayment;
    expect(lp.steel).eq(5);
    expect(lp.megacredits).eq(0);

    await wrapper.find('[data-test=megacredits] .btn-max').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.localPayment.megacredits).eq(8);
    expect(wrapper.vm.localPayment.steel).eq(1);
  });

  it('handleSave emits save immediately when cost is zero', async () => {
    const wrapper = mountPaymentForm({cost: 0});

    await wrapper.find('[data-test=save]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('save')).to.exist;
    expect(wrapper.find('.tm-warning').exists()).is.false;
  });

  it('handleSave shows warning when underpaying', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['megacredits'],
      ledger: {
        'megacredits': {available: 10, value: 1},
      },
    });
    await wrapper.find('[data-test=megacredits] input').setValue(5);
    await wrapper.find('[data-test=save]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('save')).to.not.exist;
    expect(wrapper.find('.tm-warning').exists()).is.true;
  });

  it('handleSave shows warning when spending more than available units', async () => {
    // payment claims 8 heat but only 5 are available
    const wrapper = mountPaymentForm({
      cost: 8,
      order: ['megacredits'],
      ledger: {
        'megacredits': {available: 10, value: 1},
      },
    });

    await wrapper.find('[data-test=megacredits] input').setValue(9);
    await wrapper.find('[data-test=save]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('save')).to.not.exist;
    expect(wrapper.find('.tm-warning').exists()).is.true;
  });

  it('handleSave emits save and clears warning when payment is valid', async () => {
    const wrapper = mountPaymentForm({
      cost: 10,
      order: ['megacredits'],
      ledger: {
        'megacredits': {available: 10, value: 1},
      },
    });

    // Trigger a bad save first to set a warning
    wrapper.vm.warning = 'Haven\'t spent enough';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.tm-warning').exists()).is.true;

    await wrapper.find('[data-test=save]').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('save')).to.exist;
    expect(wrapper.find('.tm-warning').exists()).is.false;
  });
});
