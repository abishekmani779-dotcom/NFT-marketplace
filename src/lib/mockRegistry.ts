export const mockRegistry = [
  {
    id: "asset-001",
    title: "Ming Dynasty Blue & White Vase",
    category: "Ceramics",
    physicalCustody: {
      vaultLocation: "Geneva Free-port, CH, Unit 4B",
      humidityTempLog: [
        { date: "2026-03-01", temp: "20.1°C", humidity: "45%" },
        { date: "2026-03-05", temp: "20.0°C", humidity: "46%" }
      ],
      lastInspected: "2026-02-15"
    },
    digitalOwnership: { contractAddress: "0x7a2...3f9c", tokenId: "1024", currentOwner: "0xAB4...918C" },
    verificationLevel: 3,
    insurancePolicy: { provider: "Lloyd's Digital Artefacts", policyId: "POL-MD-2026-991" },
    metadata: { weight: "2.4 kg", era: "15th Century", material: "Porcelain", conditionGrade: "9.2", appraiserSignature: "0xSign_Appraiser_JaneDoe" },
    priceETH: 45.5,
    priceUSDC: 125125.00,
    priceHistory: [{ date: "Jan", price: 40 }, { date: "Feb", price: 42 }, { date: "Mar", price: 45.5 }],
    // Verified: ceramic blue vase
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "asset-002",
    title: "18th Century French Pocket Watch",
    category: "Horology",
    physicalCustody: {
      vaultLocation: "London Safe Deposit, UK, Box 1022",
      humidityTempLog: [{ date: "2026-03-01", temp: "19.5°C", humidity: "40%" }],
      lastInspected: "2026-01-20"
    },
    digitalOwnership: { contractAddress: "0xbb2...1a5c", tokenId: "331", currentOwner: "0x99A...1bb3" },
    verificationLevel: 2,
    metadata: { weight: "120 g", era: "1780s", material: "18k Gold & Enamel", conditionGrade: "8.5", appraiserSignature: "0xSign_Appraiser_JohnSmith" },
    priceETH: 12.0,
    priceUSDC: 33000.00,
    priceHistory: [{ date: "Jan", price: 10 }, { date: "Feb", price: 11.5 }, { date: "Mar", price: 12.0 }],
    // Verified: pocket watch macro
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "asset-003",
    title: "Edo Period Samurai Katana",
    category: "Militaria",
    physicalCustody: {
      vaultLocation: "Tokyo Fine Storage, JP, Wing B",
      humidityTempLog: [{ date: "2026-03-01", temp: "18.0°C", humidity: "42%" }],
      lastInspected: "2026-02-10"
    },
    digitalOwnership: { contractAddress: "0xcc3...4d1e", tokenId: "2048", currentOwner: "0xDD5...3aa7" },
    verificationLevel: 3,
    insurancePolicy: { provider: "Tokio Marine Arts", policyId: "POL-KT-2026-112" },
    metadata: { weight: "1.2 kg", era: "Edo Period (1650s)", material: "Tamahagane Steel", conditionGrade: "9.5", appraiserSignature: "0xSign_Appraiser_Tanaka" },
    priceETH: 38.0,
    priceUSDC: 104500.00,
    priceHistory: [{ date: "Jan", price: 32 }, { date: "Feb", price: 35 }, { date: "Mar", price: 38 }],
    // Verified: Japanese katana / blade
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "asset-004",
    title: "Renaissance Oil on Panel",
    category: "Fine Art",
    physicalCustody: {
      vaultLocation: "Zurich Art Vault, CH, Section 3",
      humidityTempLog: [{ date: "2026-03-01", temp: "21.0°C", humidity: "50%" }],
      lastInspected: "2026-02-28"
    },
    digitalOwnership: { contractAddress: "0xee4...7b2f", tokenId: "512", currentOwner: "0xFF6...9cc1" },
    verificationLevel: 3,
    insurancePolicy: { provider: "AXA Heritage", policyId: "POL-RA-2026-744" },
    metadata: { weight: "4.8 kg", era: "16th Century", material: "Oil on panel", conditionGrade: "8.8", appraiserSignature: "0xSign_Appraiser_Romano" },
    priceETH: 120.0,
    priceUSDC: 330000.00,
    priceHistory: [{ date: "Jan", price: 100 }, { date: "Feb", price: 110 }, { date: "Mar", price: 120 }],
    // Verified: classical oil painting in gallery
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "asset-005",
    title: "Qing Dynasty Jade Buddha",
    category: "Sculptures",
    physicalCustody: {
      vaultLocation: "Hong Kong Freeport, HK, Bay 7",
      humidityTempLog: [{ date: "2026-03-01", temp: "22.0°C", humidity: "48%" }],
      lastInspected: "2026-02-05"
    },
    digitalOwnership: { contractAddress: "0xaa5...2c3d", tokenId: "777", currentOwner: "0xBB7...4ee2" },
    verificationLevel: 2,
    metadata: { weight: "3.1 kg", era: "Qing Dynasty (1830s)", material: "Imperial Jade", conditionGrade: "9.0", appraiserSignature: "0xSign_Appraiser_Chen" },
    priceETH: 67.0,
    priceUSDC: 184250.00,
    priceHistory: [{ date: "Jan", price: 55 }, { date: "Feb", price: 61 }, { date: "Mar", price: 67 }],
    // Verified: marble/stone sculpture close-up
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "asset-006",
    title: "Victorian Diamond Parure Set",
    category: "Jewelry",
    physicalCustody: {
      vaultLocation: "Geneva Free-port, CH, Unit 12A",
      humidityTempLog: [{ date: "2026-03-01", temp: "19.8°C", humidity: "38%" }],
      lastInspected: "2026-03-01"
    },
    digitalOwnership: { contractAddress: "0xff6...8a4b", tokenId: "9001", currentOwner: "0xCC8...7dd4" },
    verificationLevel: 3,
    insurancePolicy: { provider: "Lloyd's Digital Artefacts", policyId: "POL-VJ-2026-328" },
    metadata: { weight: "0.8 kg", era: "Victorian (1870s)", material: "18k Gold, 14ct Diamond", conditionGrade: "9.7", appraiserSignature: "0xSign_Appraiser_Alderton" },
    priceETH: 89.0,
    priceUSDC: 244750.00,
    priceHistory: [{ date: "Jan", price: 75 }, { date: "Feb", price: 82 }, { date: "Mar", price: 89 }],
    // Verified: diamond jewelry on dark bg
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"
  }
];

export const floorPriceData = [
  { category: "Ceramics", floor: 30 },
  { category: "Horology", floor: 10 },
  { category: "Fine Art", floor: 50 },
  { category: "Jewelry", floor: 20 },
];

export const systemHealth = {
  tvlItems: 342,
  tvlETH: 12450.5,
  anomaliesDetected: 2,
};
