// Common code for SelectHowToPay and SelectHowToPayForCard

export const PaymentWidgetMixin = {
    "methods": {
        getMegaCreditsMax: function (): number {
            return Math.min((this as any).player.megaCredits, (this as any).getCardCost());
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

            this.setRemainingMCValue();
        },
        addValue: function (target: string, to: number): void {
            let currentValue: number = (this as any)[target];
            let maxValue: number = (this as any).player[target];
            if (target === "megaCredits") maxValue = this.getMegaCreditsMax();
            if (target === "microbes") maxValue = (this as any).playerinput.microbes;
            if (target === "floaters") maxValue = (this as any).playerinput.floaters;
            if (currentValue === maxValue) return;

            const realTo = (currentValue + to <= maxValue) ? to : maxValue - currentValue;
            (this as any)[target] += realTo;

            if (target === "megaCredits" || realTo === 0) return;

            this.setRemainingMCValue();
        },
        setRemainingMCValue: function (): void {
            let costInMC: number = (this as any).getCardCost();
            let remainingMC: number = costInMC -
              (this as any)["titanium"] * this.getResourceRate("titanium") -
              (this as any)["steel"] * this.getResourceRate("steel") -
              (this as any)["microbes"] * this.getResourceRate("microbes") -
              (this as any)["floaters"] * this.getResourceRate("floaters");
            (this as any)["megaCredits"] = Math.max(0, remainingMC);
        }
    }
}
