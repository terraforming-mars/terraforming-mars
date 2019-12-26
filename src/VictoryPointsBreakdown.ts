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
}