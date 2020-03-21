export class VictoryPointsBreakdown {
    public terraformRating: number = 0;
    public milestones: number = 0;
    public awards: number = 0;
    public greenery: number = 0;
    public city: number = 0;
    public victoryPoints = 0;
    public total = 0;
    public VPdetails: Array<string> = [];

    public updateTotal(): void {
        this.total = 0;
        this.total += this.terraformRating;
        this.total += this.milestones;
        this.total += this.awards;
        this.total += this.greenery;
        this.total += this.city;
        this.total += this.victoryPoints;
    }

    public setVictoryPoints(key: string, points: number, message?: string) {

        switch (key) {
            case "terraformRating":
                this.terraformRating += points;
                break;
            case "milestones":
                this.milestones += points;
                break;
            case "awards":
                this.awards += points;
                break;
            case "greenery":
                this.greenery += points;
                break;
            case "city":
                this.city += points;
                break;
            case "victoryPoints":
                this.victoryPoints += points;
                break;
        }

        if (message !== undefined) {
            this.VPdetails.push(message+": "+points);
        }
    }

}