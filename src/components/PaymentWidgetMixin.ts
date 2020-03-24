// Common code for SelectHowToPay and SelectHowToPayForCard

export const PaymentWidgetMixin = {
    "methods": {
        getCardCost: function (): number {
            return (this as any).player.megaCredits;
        },
        getCssClassFor: function (action: string, target: string): string {
            let currentValue: number = (this as any)[target];
            let maxValue: number = (this as any).player[target];
            let disablingLimit = (action === "<") ? 0 : maxValue

            if (currentValue === disablingLimit) return "is-disabled";
            return "is-primary"
        },
        getResourceRate: function (resourceName: string): number {
            let rate = 1; // one resource == one money
            if (resourceName === "titanium") {
                rate = (this as any).player.titaniumValue;
            } else if (resourceName === "steel") {
                rate = (this as any).player.steelValue;
            } else if (resourceName === "microbes") {
                rate = 2;
            } else if (resourceName === "floaters") {
                rate = 3;
            }
            return rate;
        },
        reduceValue: function (target: string, to: number): void {
            let currentValue: number = (this as any)[target];

            if (currentValue === 0) return;

            const realTo = Math.min(to, currentValue);
            (this as any)[target] -= realTo;

            if (target === "megaCredits" || realTo === 0) return;

            let rate = this.getResourceRate(target)
            this.addValue("megaCredits", rate * realTo);

        },
        addValue: function (target: string, to: number): void {
            let currentValue: number = (this as any)[target];
            let maxValue: number = (this as any).player[target];
            if (target === "megaCredits") maxValue = this.getCardCost();
            if (target === "microbes") maxValue = (this as any).playerinput.microbes;
            if (target === "floaters") maxValue = (this as any).playerinput.floaters;
            if (currentValue === maxValue) return;

            const realTo = (currentValue + to <= maxValue) ? to : maxValue - currentValue;
            (this as any)[target] += realTo;

            if (target === "megaCredits" || realTo === 0) return;

            let rate = this.getResourceRate(target)
            this.reduceValue("megaCredits", rate * realTo);
        }
    }
}
