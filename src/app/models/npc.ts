import {RealmLocation} from "./realm-location";
import {randomElement} from "../lib/util";
import {TradeOffer} from "./trade-offer";

export enum Species {
  Human = 'human',
  Elf = 'elf',
  Dwarf = 'dwarf',
  Giant = 'giant',
  Troll = 'troll',
  Goblin = 'goblin',
  Kenku = 'kenku',
}
export enum Gender {
  Female = 'f',
  Male = 'm',
  Other = 'x',
}
export enum NpcRole {
  Shopkeeper = 'shopkeeper',
}
export enum ShopType {
  Armorer = 'armorer',
  Jeweller = 'jeweller',
  Magic = 'magic',
}
interface NpcPropMap {
  [key: string]: {
    [key: string]: any[];
  };
}
enum Greeting {
  GENERAL_1 = "Hello, how can I be of service?",
  GENERAL_2 = "Hi there! Is there something you need assistance with?",
  GENERAL_3 = "Good day! How may I help you?",
  GENERAL_4 = "Is there a way I can be of help?",
  GENERAL_5 = "What do you want?",
  GENERAL_6 = "State your purpose.",
  SHOP_1 = "What caught your interest?",
  SHOP_2 = "What can I do for you?",
  SHOP_3 = "Let me know what you're seeking, and I'll do my best.",
  SHOP_4 = "If there's something you require, just ask.",
  SHOP_5 = "Welcome! What can I help you find?",
  SHOP_6 = "Good day! What can I show you?",
  SHOP_7 = "Salutations, weary wanderer! Let my wares breathe life into your journey.",
  SHOP_8 = "You gonna buy anything or what?",
  JEWELLER_1 = "Greetings, adventurer! Prepare to be enchanted by my treasures.",
  JEWELLER_2 = "Greetings, kindred spirit! Explore the treasures of my shop.",
  JEWELLER_3 = "Well met, fellow traveler of realms! Behold, my array of treasures.",
  JEWELLER_4 = "Greetings! What brings you to my shop?",
  MAGIC_SHOP_1 = "Hail, traveler! What brings you to my humble emporium?",
  MAGIC_SHOP_2 = "Well met! Step into my sanctuary of wonders.",
  MAGIC_SHOP_3 = "Ahoy, good folk! Welcome to a realm of curiosities and curations.",
  MAGIC_SHOP_4 = "Greetings, noble seeker! Fortune favors those who browse.",
  MAGIC_SHOP_5 = "Salutations, intrepid soul! The arcane and mundane converge here.",
  MAGIC_SHOP_RUGGED_1 = "Ho there, friend! Seek ye wares of both practical and mystical?",
  SHOP_SIMPLE_1 = "You want thing?",
  SHOP_SIMPLE_2 = "Me sell. You buy?",
  SHOP_SIMPLE_3 = "You want trade?",
  SHOP_SPOOKED_1 = "Greetings, traveler! I'd be more than happy to do business, but there's a troublesome creature nearby. Mind helping me clear it out?",
  SHOP_SPOOKED_2 = "Help me clear out the nearby monster, then we can trade.",
  SHOP_SPOOKED_3 = "Aaah! Stranger, I'm in trouble. There's a monster lurking nearby! Help me, and we can talk business.",
  SHOP_SIMPLE_SPOOKED_1 = "Oh dear! Monster outside! You make it go, then we trade?",
  SHOP_SIMPLE_SPOOKED_2 = "Aaah! Me not brave! Scary thing outside! You make it go?",
  SHOP_SIMPLE_SPOOKED_3 = "Hmm. Danger nearby. You help?",
  SHOP_SPOOKED_GOBLIN = "Aaah! Me not brave Goblin! You kill monster, then we trade?",
}
export class Npc extends RealmLocation {
  public species: Species
  public gender: Gender
  public role: NpcRole
  public shopType: ShopType | undefined
  public buyOffers: TradeOffer[]
  public sellOffers: TradeOffer[]
  public portrait: string
  public spooked: boolean
  public greeting: string
  constructor(data: any) {
    super(data);
    this.species = data.species
    this.gender = data.gender
    this.role = data.role
    this.shopType = data.shopType
    this.portrait = `/assets/icon/npc-${data.portrait}.svg`
    this.spooked = data.spooked
    this.greeting = randomElement(this.greetingOptions(this.species, this.role, this.shopType, this.spooked))
    this.buyOffers = data.buyOffers.map((item: any) => new TradeOffer(item))
    this.sellOffers = data.sellOffers.map((item: any) => new TradeOffer(item))
  }

  greetingOptions(species: string, role:string, shopType:string|undefined, spooked:boolean|undefined): string[] {
    if (role !== 'shopkeeper') {
      return [
        Greeting.GENERAL_1, Greeting.GENERAL_2, Greeting.GENERAL_3, Greeting.GENERAL_4,
        Greeting.GENERAL_5, Greeting.GENERAL_6,
      ]
    }
    if (this.spooked) {
      if (['troll', 'giant'].includes(species)) {
        return [Greeting.SHOP_SIMPLE_SPOOKED_1, Greeting.SHOP_SIMPLE_SPOOKED_2, Greeting.SHOP_SIMPLE_SPOOKED_3]
      } else if (['goblin'].includes(species)) {
        return [Greeting.SHOP_SPOOKED_GOBLIN]
      }
      return [Greeting.SHOP_SPOOKED_1, Greeting.SHOP_SPOOKED_2, Greeting.SHOP_SPOOKED_3]
    }
    if (['troll', 'giant', 'goblin'].includes(species)) {
      return [Greeting.SHOP_SIMPLE_1, Greeting.SHOP_SIMPLE_2, Greeting.SHOP_SIMPLE_3]
    }
    switch(shopType) {
      case 'armorer':
        return [
          Greeting.GENERAL_1, Greeting.GENERAL_4, Greeting.SHOP_2,
          Greeting.SHOP_3, Greeting.SHOP_3, Greeting.SHOP_6
        ]
      case 'jeweller':
        return [
          Greeting.SHOP_1, Greeting.SHOP_2, Greeting.SHOP_3,
          Greeting.SHOP_4, Greeting.SHOP_5, Greeting.SHOP_6,
          Greeting.JEWELLER_1, Greeting.JEWELLER_2, Greeting.JEWELLER_3, Greeting.JEWELLER_4
        ]
      case 'magic':
        if (species === 'dwarf') {
          return [Greeting.GENERAL_5, Greeting.MAGIC_SHOP_RUGGED_1]
        }
        return [
          Greeting.SHOP_8, Greeting.MAGIC_SHOP_1, Greeting.MAGIC_SHOP_2,
          Greeting.MAGIC_SHOP_3, Greeting.MAGIC_SHOP_4, Greeting.MAGIC_SHOP_5,
        ]
      default:
        return [
          Greeting.SHOP_1, Greeting.SHOP_2, Greeting.SHOP_3, Greeting.SHOP_4,
          Greeting.SHOP_5, Greeting.SHOP_6, Greeting.SHOP_7,
        ]
    }
  }
}
