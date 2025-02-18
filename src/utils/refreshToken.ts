import { CustomError } from "../ErrorHandler";
import { MercadoLibreAuthResponse } from "../types/mercadoLibreAuthResponse";
import * as dotenv from 'dotenv';
dotenv.config();
export const refreshToken = async (): Promise<string> => {
    const refreshUrl = `${process.env.MERCADO_LIBRE_API_URL}/oauth/token`;    
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.MERCADO_LIBRE_API_CLIENT_ID!,
      client_secret: process.env.MERCADO_LIBRE_API_CLIENT_SECRET!,
      refresh_token: process.env.MERCADO_LIBRE_API_REFRESH_TOKEN!,
    });
  
    try {
      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
  
      if (!response.ok) {
        throw new CustomError(`Failed to refresh token: ${response.statusText}`,response.status);
      }
  
      const data = await response.json() as MercadoLibreAuthResponse;
      
      process.env.MERCADO_LIBRE_API_TOKEN = data.access_token;
  
      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new CustomError("Token refresh failed",400);
    }
  };
  
