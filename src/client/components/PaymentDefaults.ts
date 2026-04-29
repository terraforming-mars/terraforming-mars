import {Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
import {Ledger} from '@/client/components/PaymentLedger';

function unitContribution(
  cost: number,
  ledger: Ledger,
  mcAlreadyCovered: number,
  unit: SpendableResource,
): {units: number, mcValue: number} {
  const entry = ledger[unit];
  if (!entry || entry.available <= 0) return {units: 0, mcValue: 0};

  const {available, value: rate} = entry;
  const mcAvailable = ledger['megacredits'].available;

  let units = Math.min(
    Math.ceil(Math.max(cost - mcAvailable - mcAlreadyCovered, 0) / rate),
    available,
  );
  let mcValue = units * rate;

  // Greedy: add more units as long as we don't push the total past the cost.
  // Heat is non-greedy: only use the minimum needed.
  // The condition includes mcAlreadyCovered so two resources together cannot overspend.
  if (unit !== 'heat') {
    while (units < available && mcAlreadyCovered + mcValue + rate <= cost) {
      units++;
      mcValue += rate;
    }
  }

  return {units, mcValue};
}

// Compute the optimal default payment given a cost, the ordered list of
// spendable resources, and the ledger of available amounts and rates.
//
// When reserveMegacredits is true, MC are treated as already committed (i.e.
// the caller has already maxed MC) and other resources fill only the remainder.
export function computeDefaultPayment(
  cost: number,
  order: ReadonlyArray<SpendableResource>,
  ledger: Ledger,
  reserveMegacredits: boolean = false,
): Partial<Payment> {
  const result: Partial<Payment> = {};
  const mcAvailable = ledger['megacredits'].available;

  let amountCovered = reserveMegacredits ? mcAvailable : 0;
  // resourcesAlreadyCovered tracks only the MC value of resources committed so far,
  // not the reserved MC. This prevents the greedy condition from double-counting the
  // reserved MC ceiling, which would cause under-allocation when reserveMegacredits=true.
  let resourcesAlreadyCovered = 0;
  for (const unit of order) {
    if (unit === 'megacredits') continue;
    const {units, mcValue} = unitContribution(cost, ledger, resourcesAlreadyCovered, unit);
    result[unit] = units;
    amountCovered += mcValue;
    resourcesAlreadyCovered += mcValue;
  }

  // Post-pass: if resources overspent (can happen when two high-rate resources
  // combine), reduce units in reverse order until overspend is gone.
  if (amountCovered > cost) {
    for (const unit of [...order].reverse()) {
      if (unit === 'megacredits') continue;
      const rate = ledger[unit].value;
      while ((result[unit] ?? 0) > 0 && amountCovered - rate >= cost) {
        result[unit] = (result[unit] as number) - 1;
        amountCovered -= rate;
      }
    }
  }

  if (!reserveMegacredits) {
    result.megacredits = Math.min(mcAvailable, Math.max(cost - amountCovered, 0));
  }

  return result;
}
