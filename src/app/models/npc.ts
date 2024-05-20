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
  Alchemist = 'alchemist',
  Druid = 'druid',
  Castle = 'castle',
  Shopkeeper = 'shopkeeper',
}
export enum ShopType {
  Alchemist = 'alchemist',
  Armorer = 'armorer',
  Castle = 'castle',
  Druid = 'druid',
  Equipment = 'equipment',
  Jeweller = 'jeweller',
  Magic = 'magic',
}
enum Greeting {
  GENERAL_1 = "Hello, how can I be of service?",
  GENERAL_2 = "Hi there! Is there something you need assistance with?",
  GENERAL_3 = "Good day! How may I help you?",
  GENERAL_4 = "Is there a way I can be of help?",
  GENERAL_5 = "What do you want?",
  GENERAL_6 = "State your purpose.",
  GENERAL_7 = "Ah, a traveler. What brings you here?",
  GENERAL_8 = "Hello. How may I help you, %user_name%?",
  SHOP_1 = "What caught your interest?",
  SHOP_2 = "What can I do for you?",
  SHOP_3 = "Let me know what you're seeking, and I'll do my best.",
  SHOP_4 = "If there's something you require, just ask.",
  SHOP_5 = "Welcome! What can I help you find?",
  SHOP_6 = "Good day! What can I show you?",
  SHOP_7 = "Salutations, weary wanderer! Let my wares breathe life into your journey.",
  SHOP_8 = "You gonna buy anything or what?",
  EQUIPMENT_1 = "Oh, please come in, %user_name%. What sort of goods do you need?",
  EQUIPMENT_2 = "Welcome to my adventurer shop, %user_name%! What do you need?",
  ARMORER_1 = "Ah, a traveler! Welcome to my forge.",
  ARMORER_2 = "Welcome to my shop, adventurer! I trade with weapons and armor.",
  JEWELLER_1 = "Greetings, adventurer! Prepare to be enchanted by my treasures.",
  JEWELLER_2 = "Greetings, kindred spirit! Explore the treasures of my shop.",
  JEWELLER_3 = "Well met, fellow traveler of realms! Behold, my array of treasures.",
  JEWELLER_4 = "Greetings! What brings you to my shop?",
  JEWELLER_5 = "Oh, please come in, %user_name%. What do you need? Have a look at my wonderful offers in gems and jewellery.",
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
  KENKU_1 = "Squawk! Erm, I mean, Hello.",
  REMOTE_1 = "I don't get many visitors here.",
  OBSERVATORY_1 = "What brings you to this sanctum of stars?",
  OBSERVATORY_2 = "Ah, another admirer of the infinite. Well met.",
  OBSERVATORY_3 = "Ah, a new face beneath the stars! Welcome to the Observatory! I am %npc_name%, custodian of alchemical mysteries and celestial wonders.",
  OBSERVATORY_4 = "Greetings! If it's knowledge you seek or secrets of the skies, you've come to the right spire.",
  SHOP_SPOOKED_GOBLIN = "Aaah! Me not brave Goblin! You kill monster, then we trade?",
  FOX_1 = "Oh, hi there!",
  FOX_2 = "Shrouded in whispers, the path reveals itself to the worthy. Greetings, traveler.",
  FOX_3 = "Beneath the moon's silent gaze, we meet. What secrets do you seek?",
  FOX_4 = "The wind speaks, the spirit listens.",
  FOX_5 = "A thousand eyes watch from the shadows; only a few will see the truth. Are you one of them?",

  // DEPOT_1 = "Welcome to our bank, %user_name%! What can we do for you?",

  // Interactive
  // Welcome to Frodo's Hut. You heard about the news?
  // DRUID_1 = "Welcome, traveler, to my sanctuary. I am a guardian of the natural world, bound by the ancient vows of the Verdant Sentinels to protect this sacred place. How may the wisdom of the forest assist you on your journey?"
}
export class Npc extends RealmLocation {
  public species: Species
  public gender: Gender
  public jobTitle: string
  public buyOffers: TradeOffer[]
  public sellOffers: TradeOffer[]
  public portrait: string
  public override role!: NpcRole;
  public override shopType!: ShopType;
  public override spooked!: boolean
  public greeting: (userName: any) => any
  constructor(data: any, timeDiff: number) {
    super(data, timeDiff);
    this.species = data.species
    this.gender = data.gender
    this.role = data.role
    this.shopType = data.shopType
    this.jobTitle = data.role === NpcRole.Shopkeeper ? NpcRole.Shopkeeper : ''
    this.portrait = `/assets/icon/portrait/${data.portrait}.svg`
    this.spooked = data.spooked
    this.greeting = (() => {
      let template = randomElement(this.greetingOptions(this.species, this.role, this.shopType, this.spooked))
      return template.replace('%npc_name%', this.name);
    })()
    this.buyOffers = data.buyOffers.map((item: any) => new TradeOffer(item))
    this.sellOffers = data.sellOffers.map((item: any) => new TradeOffer(item))
  }

  greetingOptions(species: string, role:string, shopType:string|undefined, spooked:boolean|undefined): string[] {
    if (species === 'kenku' && Math.floor(Math. random()*10) === 0) {
      return [Greeting.KENKU_1]; // Special Kenku greeting has a 1/10 chance of happening
    }
    if (!shopType) {
      return [
        Greeting.GENERAL_1, Greeting.GENERAL_2, Greeting.GENERAL_3, Greeting.GENERAL_4,
        Greeting.GENERAL_5, Greeting.GENERAL_6,
      ]
    }
    if (spooked) {
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
      case 'alchemist':
        return [
          Greeting.GENERAL_7, Greeting.REMOTE_1,
          Greeting.OBSERVATORY_1, Greeting.OBSERVATORY_2, Greeting.OBSERVATORY_3, Greeting.OBSERVATORY_4,
        ]
      case 'armorer':
        return [
          Greeting.GENERAL_1, Greeting.GENERAL_4,
          Greeting.SHOP_2, Greeting.SHOP_3, Greeting.SHOP_4, Greeting.SHOP_6,
          Greeting.ARMORER_1, Greeting.ARMORER_2,
        ]
      case 'castle':
        return [
          Greeting.GENERAL_1, Greeting.GENERAL_4,
          Greeting.SHOP_1, Greeting.SHOP_2,
        ]
      case 'equipment':
        return [
          Greeting.GENERAL_1, Greeting.GENERAL_3, Greeting.GENERAL_4,
          Greeting.EQUIPMENT_1, Greeting.EQUIPMENT_2,
          Greeting.SHOP_5, Greeting.SHOP_6,
        ]
      case 'druid':
        if (species === 'fox') {
          return [
            Greeting.GENERAL_7, Greeting.GENERAL_8,
            Greeting.FOX_1, Greeting.FOX_2, Greeting.FOX_3, Greeting.FOX_4, Greeting.FOX_5,
          ]
        }
        return [
          Greeting.GENERAL_7, Greeting.GENERAL_8,
          Greeting.REMOTE_1,
        ]
      case 'jeweller':
        return [
          Greeting.SHOP_1, Greeting.SHOP_2, Greeting.SHOP_3,
          Greeting.SHOP_4, Greeting.SHOP_5, Greeting.SHOP_6,
          Greeting.JEWELLER_1, Greeting.JEWELLER_2, Greeting.JEWELLER_3,
          Greeting.JEWELLER_4, Greeting.JEWELLER_5,
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
