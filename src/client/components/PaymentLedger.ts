import {DEFAULT_PAYMENT_VALUES} from '@/common/inputs/Payment';
import {SPENDABLE_RESOURCES, SpendableResource} from '@/common/inputs/Spendable';

export type LedgerEntry = {
  available: number,
  value: number,
  reserved?: boolean,
};

export type Ledger = Record<SpendableResource, LedgerEntry>;

export function newDefaultLedger(): Ledger {
  const ledger = {} as Ledger;

  for (const unit of SPENDABLE_RESOURCES) {
    ledger[unit] = {available: 0, value: DEFAULT_PAYMENT_VALUES[unit]};
  }

  return ledger;
}
