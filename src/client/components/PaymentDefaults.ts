import {Payment} from '@/common/inputs/Payment';
import {SpendableResource} from '@/common/inputs/Spendable';
import {Ledger} from '@/client/components/PaymentLedger';

/**
 * Compute the optimal default payment given a cost, the ordered list of
 * spendable resources, and the ledger of available amounts and rates.
 *
 * When reserveMegacredits is true, MC are treated as already committed (i.e.
 * the caller has already maxed MC) and other resources fill only the remainder.
 *
 * @param cost - Total MC cost to cover.
 * @param order - Spendable resources in priority order.
 * @param ledger - Available amounts and exchange rates for each resource.
 * @param reserveMegacredits - If true, MC are pre-committed and non-MC resources fill the gap.
 * @returns A Payment allocating resources to cover the cost.
 */
export function computeDefaultPayment(
  cost: number,
  order: ReadonlyArray<SpendableResource>,
  ledger: Ledger,
  reserveMegacredits: boolean,
): Payment {
  const payment = {...Payment.EMPTY};
  const mcAvailable = ledger['megacredits'].available;

  let amountCovered = reserveMegacredits ? mcAvailable : 0;
  // resourcesAlreadyCovered tracks only the MC value of resources committed so far,
  // not the reserved MC. This prevents the greedy condition from double-counting the
  // reserved MC ceiling, which would cause under-allocation when reserveMegacredits=true.
  let resourcesAlreadyCovered = 0;
  for (const unit of order) {
    if (unit === 'megacredits') {
      continue;
    }
    const count = unitContribution(cost, unit, ledger, resourcesAlreadyCovered);
    const mcValue = ledger[unit].rate * count;

    payment[unit] = count;
    amountCovered += mcValue;
    resourcesAlreadyCovered += mcValue;
  }

  // Post-pass: if resources overspent (can happen when two high-rate resources
  // combine), reduce units in reverse order until overspend is gone.
  if (amountCovered > cost) {
    for (const unit of [...order].reverse()) {
      if (unit === 'megacredits') {
        continue;
      }
      const rate = ledger[unit].rate;
      while (payment[unit] > 0 && amountCovered - rate >= cost) {
        payment[unit] --;
        amountCovered -= rate;
      }
    }
  }

  if (!reserveMegacredits) {
    payment.megacredits = Math.min(mcAvailable, Math.max(cost - amountCovered, 0));
  }

  return payment;
}

/**
 * Returns the number of units of a resource to contribute toward a cost.
 *
 * Logic involves a minimum requirement to cover the gap (cost minus MC and
 * other resources), followed by a greedy allocation for non-heat resources
 * to maximize resource usage without exceeding the total cost.
 *
 * @param cost - Total MC cost to cover.
 * @param unit - The specific spendable resource being evaluated.
 * @param ledger - Available amounts and exchange rates for each resource.
 * @param mcAlreadyCovered - The MC value already committed by previously processed non-MC resources.
 * @returns The number of units of the resource to allocate.
 */
function unitContribution(
  cost: number,
  unit: SpendableResource,
  ledger: Ledger,
  mcAlreadyCovered: number,
): number {
  const entry = ledger[unit];
  if (entry.available <= 0) {
    return 0;
  }

  const {available, rate} = entry;
  const mcAvailable = ledger['megacredits'].available;

  let count = Math.min(
    Math.ceil(Math.max(cost - mcAvailable - mcAlreadyCovered, 0) / rate),
    available,
  );

  // Greedy: add more units as long as we don't push the total past the cost.
  // Heat is non-greedy: only use the minimum needed.
  // The condition includes mcAlreadyCovered so two resources together cannot overspend.
  if (unit !== 'heat') {
    let mcValue = count * rate;
    while (count < available && mcAlreadyCovered + mcValue + rate <= cost) {
      count++;
      mcValue += rate;
    }
  }

  return count;
}
