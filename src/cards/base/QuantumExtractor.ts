import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class QuantumExtractor implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SCIENCE, Tags.ENERGY];
    public name = CardName.QUANTUM_EXTRACTOR;
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 4;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.SPACE) !== -1) {
        return 2;
      }
      return 0;
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 4);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '079',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      renderData: CardRenderer.builder((b) => {
        b.effect('When you play a Space card, you pay 2 MC less for it.', (eb) => {
          eb.space().played.startEffect.megacredits(-2);
        }).br;
        b.productionBox((pb) => pb.energy(4).digit);
      }),
      description: 'Requires 4 science tags. Increase your energy production 4 steps.',
    }
}
