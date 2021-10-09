import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {SelectAmount} from '../../inputs/SelectAmount';
import {AndOptions} from '../../inputs/AndOptions';

export class Cyanobacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CYANOBACTERIA,
      cost: 12,
      tags: [Tags.MICROBE, Tags.MARS],

      metadata: {
        cardNumber: 'Pf27',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).br;
          b.microbes(1).asterix().slash().oceans(1).br;
        }),
        // TODO(kberg): include Wetlands
        description: 'Raise the oxygen level 1%. For every ocean tile, place a microbe on any card.',
      },
    });
  }

  public play(player: Player) {
    player.game.increaseOxygenLevel(player, 1);
    const microbes = player.game.board.getOceansOnBoard();
    if (microbes === 0) {
      return undefined;
    }
    const microbeCards = player.getResourceCards(ResourceType.MICROBE);

    if (microbeCards.length === 0) {
      return undefined;
    }
    if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], {qty: microbes, log: true});
      return undefined;
    }
    const map = new Map<CardName, number>();
    const options = microbeCards.map((card) => {
      // Call back for the selectAmount. Store them in the map first, so
      // they can be counted and affirmed as enough.
      const cb = (amount: number) => {
        map.set(card.name, amount);
        return undefined;
      };

      return new SelectAmount(card.name, '', cb, 0, microbes);
    });

    return new AndOptions(() => {
      let sum = 0;
      microbeCards.forEach((card) => {
        sum += map.get(card.name) ?? 0;
      });
      if (sum !== microbes) {
        throw new Error(`Expecting ${microbes} microbes, got ${sum}.`);
      }
      microbeCards.forEach((card) => {
        const amount = map.get(card.name) ?? 0;
        if (amount > 0) {
          player.addResourceTo(card, {qty: amount, log: true});
        }
      });
      return undefined;
    }, ...options);
  }
}

