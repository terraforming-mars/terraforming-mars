export class VictoryPointsBreakdown {
    public terraformRating: number = 0;
    public milestones: number = 0;
    public awards: number = 0;
    public greenery: number = 0;
    public city: number = 0;
    public victoryPoints = 0;
    public total = 0;
    public detailsCards: Array<string> = [];
    public detailsMilestones: Array<string> = [];
    public detailsAwards: Array<string> = [];

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
                if (message !== undefined) this.detailsMilestones.push(message+": "+points);
                break;
            case "awards":
                this.awards += points;
                if (message !== undefined) this.detailsAwards.push(message+": "+points);
                break;
            case "greenery":
                this.greenery += points;
                break;
            case "city":
                this.city += points;
                break;
            case "victoryPoints":
                this.victoryPoints += points;
                if (message !== undefined) this.detailsCards.push(message+": "+points);
                break;
        }

    }

}