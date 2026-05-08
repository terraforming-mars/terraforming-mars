import {DEFAULT_PAYMENT_VALUES} from '@/common/inputs/Payment';
import {SPENDABLE_RESOURCES, SpendableResource} from '@/common/inputs/Spendable';

/**
 * Data about the resources that can be spent for this action.
 */
export type Ledger = Record<SpendableResource, {
  /** The number of resources available, omitting reserved resources */
  available: number,
  /** The exchange rate for units of this resource */
  rate: number,
  /** Whether any resources are held in reserve. */
  reserved?: boolean,
}>;

export function newDefaultLedger(): Ledger {
  const ledger = {} as Ledger;
  for (const unit of SPENDABLE_RESOURCES) {
    ledger[unit] = {available: 0, rate: DEFAULT_PAYMENT_VALUES[unit]};
  }
  return ledger;
}
