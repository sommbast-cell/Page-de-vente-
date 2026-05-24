export type WineColor = 'rouge' | 'blanc' | 'rose' | 'effervescent' | 'pack' | 'mixte';

export interface Wine {
  slug: string;
  name: string;
  vintage: number;
  color: WineColor;
  appellation: string;
  region: string;
  country: string;
  domain: string;
  grapes: string;
  alcohol: string;
  volume: string;
  price: number;
  minOrder: number;
  stock: number;
  featured: boolean;
  image: string;
  shortDescription: string;
  story: string;
  tasting: {
    robe: string;
    nez: string;
    bouche: string;
  };
  pairings: string;
  keeping: string;
  awards: string[];
  composition?: string[];
  tags: string[];
}

export interface CartItem {
  slug: string;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  description: string;
  quoteOnly?: boolean;
}

export interface SiteConfig {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    city: string;
    email: string;
    phone: string;
    whatsapp: string;
    siret: string;
    address: string;
    instagram: string;
    facebook: string;
  };
  sale: {
    startDate: string;
    endDate: string;
    validationDelay: string;
    deliveryDelay: string;
    fullExplanation: string;
  };
  shipping: {
    currency: string;
    options: ShippingOption[];
  };
  legal: {
    tvaNote: string;
    evinNotice: string;
    ageGate: boolean;
  };
}
