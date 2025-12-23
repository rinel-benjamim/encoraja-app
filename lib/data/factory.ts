
import { IDataService } from "./interface"
import { PrismaDataService } from "./prisma-service"
import { JsonDataService } from "./json-service"

export function getDataService(): IDataService {
  // Check if running in Vercel production
  // Vercel sets VERCEL=1
  // We can also check NODE_ENV
  
  const isVercel = process.env.VERCEL === '1'
  const useJson = process.env.USE_JSON_DB === 'true' || isVercel

  if (useJson) {
    // Singleton instance could be used here to persist memory across hot reloads in dev
    // But in serverless it resets anyway
    return new JsonDataService()
  }

  return new PrismaDataService()
}
