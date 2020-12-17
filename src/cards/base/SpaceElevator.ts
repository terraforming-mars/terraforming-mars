import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceElevator implements IActionCard, IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE, Tags.STEEL];
    public name = CardName.SPACE_ELEVATOR;
    public cardType = CardType.ACTIVE;

    public play(player: Player, _game: Game) {
      player.addProduction(Resources.TITANIUM);
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.steel > 0;
    }
    public action(player: Player, _game: Game) {
      player.steel--;
      player.megaCredits += 5;
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '203',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.steel(1).startAction.megacredits(5);
          eb.description('Action: Spend 1 steel to gain 5 MC.');
        }).br;
        b.productionBox((pb) => pb.titanium(1));
      }),
      description: 'Increase your titanium production 1 step.',
      victoryPoints: 2,
    }
}

