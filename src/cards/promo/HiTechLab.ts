import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectCardToKeep} from '../../deferredActions/SelectCardToKeep';

export class HiTechLab implements IProjectCard {
    public name = CardName.HI_TECH_LAB;
    public cost = 17;
    public tags = [Tags.SCIENCE, Tags.STEEL];
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }

    public canAct(player: Player): boolean {
      return player.getResource(Resources.ENERGY) > 0;
    }

    public action(player: Player, game: Game) {
      return new SelectAmount('Select amount of energy to spend', 'Spend energy', (amount: number) => {
        // 0 amount failsafe
        if (amount === 0 ) {
          return undefined;
        }
        player.setResource(Resources.ENERGY, -amount);
        const cardsDrawn: Array<IProjectCard> = [];
        for (let counter = 0; counter < amount; counter++) {
          cardsDrawn.push(game.dealer.dealCard());
        };
        game.defer(new SelectCardToKeep(player, game, 'Select card to take into hand', cardsDrawn));
        return undefined;
      }, player.getResource(Resources.ENERGY));
    }

    public getVictoryPoints() {
      return 1;
    }
}
