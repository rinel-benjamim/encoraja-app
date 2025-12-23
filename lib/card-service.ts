import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import type { Card } from "@/types/card"

const CARDS_COLLECTION = "cards"

export async function createCard(cardData: Omit<Card, "id" | "createdAt" | "views">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CARDS_COLLECTION), {
      ...cardData,
      createdAt: serverTimestamp(),
      views: 0,
    })
    return docRef.id
  } catch (error) {
    console.error("Erro ao criar cartão:", error)
    throw error
  }
}

export async function getCard(id: string): Promise<Card | null> {
  try {
    const docRef = doc(db, CARDS_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      // Converter Timestamp para number (millis) se necessário
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now()
      
      return {
        id: docSnap.id,
        ...data,
        createdAt,
      } as Card
    } else {
      return null
    }
  } catch (error) {
    console.error("Erro ao buscar cartão:", error)
    throw error
  }
}

export async function getUserCards(userId: string): Promise<Card[]> {
  try {
    const q = query(
      collection(db, CARDS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now()
      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Card
    })
  } catch (error) {
    console.error("Erro ao buscar cartões do usuário:", error)
    throw error
  }
}

export async function incrementCardViews(id: string): Promise<void> {
  try {
    const docRef = doc(db, CARDS_COLLECTION, id)
    await updateDoc(docRef, {
      views: increment(1),
    })
  } catch (error) {
    console.error("Erro ao incrementar visualizações:", error)
    // Não lançar erro para não bloquear a UI se falhar
  }
}
