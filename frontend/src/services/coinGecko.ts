// CoinGecko service for fetching live cryptocurrency prices with a local fallback system

// Standard fallback prices if CoinGecko rate limits the API client (429 status)
const FALLBACK_PRICES: Record<string, number> = {
  bitcoin: 92850.0,
  ethereum: 2840.0,
  solana: 172.5,
  cardano: 0.48,
  ripple: 1.15,
  polkadot: 6.2,
  dogecoin: 0.35,
  avalanche: 28.9,
  chainlink: 14.2,
  litecoin: 78.4,
};

export const fetchLivePrices = async (coinIds: string[]): Promise<Record<string, number>> => {
  if (coinIds.length === 0) {
    return {};
  }

  // Deduplicate and filter coin IDs to prevent errors
  const cleanIds = Array.from(new Set(coinIds.map(id => id.trim().toLowerCase())));
  
  try {
    const idsParam = cleanIds.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const prices: Record<string, number> = {};

    cleanIds.forEach((id) => {
      if (data[id] && typeof data[id].usd === 'number') {
        prices[id] = data[id].usd;
      } else {
        // Fallback or default if coin isn't found in data
        prices[id] = FALLBACK_PRICES[id] || 1.0;
      }
    });

    return prices;
  } catch (err) {
    console.warn('CoinGecko API failed. Using local fallback prices.', err);
    // Populate return object with fallback values
    const prices: Record<string, number> = {};
    cleanIds.forEach((id) => {
      prices[id] = FALLBACK_PRICES[id] || 1.0;
    });
    return prices;
  }
};
