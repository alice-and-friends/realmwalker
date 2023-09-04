import {Item} from "./item";

export class TradeOffer extends Item {
  buyOffer: number;
  sellOffer: number;
  _userHas: number = 0; // This can be populated by controllers to indicate how many instances of this item are in the player's inventory

  constructor(data: any) {
    super(data)

    this.buyOffer = data.buyOffer;
    this.sellOffer = data.sellOffer;
  }
}
