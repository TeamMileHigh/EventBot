import axios from 'axios';
import { config } from './Config.js'; 

type Token = {
  id: string;
  symbol: string;
};

type Pool = {
  id: string;
  token0: Token;
  token1: Token;
  volumeUSD: string;
};


export async function queryGraph(): Promise<string> {
  if (typeof process.env.GRAPHQL_ENDPOINT !== 'string') {
    throw new Error('GRAPHQL_URL is not set.');
  }
    
  const graphqlUrl = process.env.GRAPHQL_ENDPOINT; 
  const query = `
    {
      pools(first: 3, orderBy: volumeUSD, orderDirection: desc) {
        id
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
        volumeUSD
      }
    }
  `;

  try {
    const response = await axios.post(graphqlUrl, {
      query: query
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000 
    });

    const data: Pool[] = response.data.data.pools;

    let resultString: string = "Top 3 Pools with the Highest Total Volume in USD:\n";
    data.forEach((pool: Pool, index: number) => {
    const poolInfo: string = `${index + 1}. Pool ID: ${pool.id}\n` +
                              `   Tokens: ${pool.token0.symbol}/${pool.token1.symbol}\n` +
                              `   Volume (USD): $${parseFloat(pool.volumeUSD).toLocaleString('en-US', {maximumFractionDigits: 2})}\n`;
    resultString += poolInfo;
    });

    return resultString
  } catch (error) {
    console.error('Failed to query the GraphQL endpoint:', error);
    // Handle or rethrow the error appropriately
    throw error; // Rethrow the error or handle it based on your use case
  }
}
