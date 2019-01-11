
export class Shuttles implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Shuttles";
    public text: string = "Requires 5% oxygen. Decrease your energy production 1 step and increase your mega credit production 2 steps.";
    public description: "Aided by low gravity going up, and by the increasing atmosphere when gliding down for landing.";
    
}
