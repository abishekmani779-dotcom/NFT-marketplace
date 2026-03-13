export interface AntiqueNFT {
  id: string;
  title: string;
  era: string;
  material: string;
  priceEth: number;
  priceUsd: number;
  imageUrl: string;
  galleryUrls: string[];
  provenanceScore: number;
  nfcLinked: boolean;
  contractAddress: string;
  tokenId: string;
  description: string;
  history: {
    year: string;
    event: string;
    description: string;
    hash: string;
  }[];
}

export const mockAntiques: AntiqueNFT[] = [
  {
    id: "aq-001",
    title: "Ming Dynasty Blue & White Vase",
    era: "Ming Dynasty",
    material: "Porcelain",
    priceEth: 12.5,
    priceUsd: 38500,
    // Verified: blue & white ceramic vase
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600",
    galleryUrls: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1200"
    ],
    provenanceScore: 98,
    nfcLinked: true,
    contractAddress: "0x7a2...b49f",
    tokenId: "8472",
    description: "An exceptionally rare Ming Dynasty vase featuring the classic cobalt blue underglaze. Characterized by intricate floral motifs and unblemished structural integrity. Appraised by Sotheby's in 2021.",
    history: [
      { year: "1522", event: "Creation", description: "Fired in the Imperial Kilns at Jingdezhen during the Jiajing reign.", hash: "0x..." },
      { year: "1984", event: "Auction", description: "Acquired by a private collector in London for £45,000.", hash: "0x..." },
      { year: "2021", event: "Authentication", description: "Verified and NFC micro-tagged by Global Art Provenance.", hash: "0x..." },
      { year: "2023", event: "Tokenization", description: "Minted as a Digital Twin on Aura Protocol.", hash: "0xfa1..." }
    ]
  },
  {
    id: "aq-002",
    title: "16th Century Renaissance Globe",
    era: "Renaissance",
    material: "Wood & Brass",
    priceEth: 8.2,
    priceUsd: 25200,
    // Verified: antique globe on desk
    imageUrl: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=600",
    galleryUrls: [
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&q=80&w=1200"
    ],
    provenanceScore: 94,
    nfcLinked: true,
    contractAddress: "0x3f9...d1a2",
    tokenId: "1098",
    description: "Hand-crafted terrestrial globe from the late Renaissance period. Features accurate (for the era) cartography. The brass meridian ring remains in excellent working condition.",
    history: [
      { year: "1590", event: "Creation", description: "Crafted in Venice by master cartographers.", hash: "0x..." },
      { year: "1920", event: "Inheritance", description: "Passed within the di Lorenzo family estate.", hash: "0x..." },
      { year: "2024", event: "Tokenization", description: "Digitized via Aura Protocol.", hash: "0xcc2..." }
    ]
  },
  {
    id: "aq-003",
    title: "Roman Marble Bust",
    era: "Roman Empire",
    material: "Marble",
    priceEth: 45.0,
    priceUsd: 138000,
    // Verified: white marble classical sculpture
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&q=80&w=600",
    galleryUrls: [
      "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&q=80&w=1200"
    ],
    provenanceScore: 99,
    nfcLinked: true,
    contractAddress: "0x91e...c221",
    tokenId: "772",
    description: "Exceptional life-size marble portrait bust depicting a young aristocrat of the Antonine period. Notable for the beautifully preserved drill work in the hair and polished skin tone.",
    history: [
      { year: "160 CE", event: "Creation", description: "Carved in Rome.", hash: "0x..." },
      { year: "1856", event: "Excavation", description: "Discovered near the Appian Way by archaeological teams.", hash: "0x..." },
      { year: "2010", event: "Restoration", description: "Minor surface cleaning by the Italian Ministry of Culture.", hash: "0x..." },
      { year: "2024", event: "Tokenization", description: "Verified Authentic Physical Asset on Aura Protocol.", hash: "0xbb8..." }
    ]
  }
];
