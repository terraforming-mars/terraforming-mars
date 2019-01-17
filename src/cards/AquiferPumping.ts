
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class AquiferPumping implements IActiveProjectCard {
    public cost: 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Aquifer Pumping";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public description: string = "Underground water reservoirs may be tapped in a controlled manner, to safely build up oceans to the desired level";
    public play(player: Player, game: Game): Promise<void> {
        // Nothing happens when played
        return Promise.resolve();
    }
    public actionText: string = "Spend 8 mega credits to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.";
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalPaid = 0;
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAmount"
            }, (steelAmount: string) => {
                if (parseInt(steelAmount) > player.steel) {
                    reject("Not enough steel");
                    return;
                }
                totalPaid += parseInt(steelAmount) * 2;
                player.setWaitingFor(undefined);
                if (totalPaid < 8) {
                    player.setWaitingFor({
                        initiator: "card",
                        card: this,
                        type: "SelectAmount"
                    }, (megaCreditAmount: string) => {
                        if (parseInt(megaCreditAmount) > player.megaCredits) {
                            reject("Not enough mega credits");
                            return;
                        }
                        totalPaid += parseInt(megaCreditAmount);
                        if (totalPaid < 8) {
                            reject("Need to pay 8");
                            return;
                        }
                        player.setWaitingFor({
                            initiator: "card",
                            card: this,
                            type: "SelectASpace"
                        }, (spaceId: string) => {
                            try { game.addOceanTile(player, spaceId); }
                            catch (err) { reject(err); return; }
                            player.steel -= parseInt(steelAmount);
                            player.megaCredits -= parseInt(megaCreditAmount);
                            resolve();
                            return;
                        });
                    });
                } else {
                    player.setWaitingFor({
                        initiator: "card",
                        card: this,
                        type: "SelectASpace"
                    }, (spaceId: string) => {
                        try { game.addOceanTile(player, spaceId) }
                        catch (err) { reject(err); return; }
                        player.steel -= parseInt(steelAmount);
                        resolve();
                        return;
                    });
                }
            });
        });
    }
}

