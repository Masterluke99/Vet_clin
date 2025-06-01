import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Tutor } from '../types/TutorTypes';

export const TutorService = {
  getTutores: async (): Promise<Tutor[]> => {
    try {
      const tutoresSnapshot = await getDocs(collection(db, 'tutores'));
      return tutoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Tutor[];
    } catch (error) {
      console.error("Erro ao buscar tutores:", error);
      throw error;
    }
  },
  
  getTutorById: async (id: string): Promise<Tutor | null> => {
    try {
      const tutorDoc = await getDoc(doc(db, 'tutores', id));
      if (!tutorDoc.exists()) {
        return null;
      }
      return {
        id: tutorDoc.id,
        ...tutorDoc.data(),
        createdAt: tutorDoc.data().createdAt?.toDate(),
        updatedAt: tutorDoc.data().updatedAt?.toDate()
      } as Tutor;
    } catch (error) {
      console.error("Erro ao buscar tutor:", error);
      throw error;
    }
  },
  
  addTutor: async (tutor: Omit<Tutor, 'id'>): Promise<Tutor> => {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'tutores'), {
        ...tutor,
        createdAt: now,
        updatedAt: now
      });
      return {
        id: docRef.id,
        ...tutor,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error("Erro ao adicionar tutor:", error);
      throw error;
    }
  },
  
  updateTutor: async (id: string, tutor: Partial<Omit<Tutor, 'id'>>): Promise<void> => {
    try {
      const tutorRef = doc(db, 'tutores', id);
      await updateDoc(tutorRef, {
        ...tutor,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Erro ao atualizar tutor:", error);
      throw error;
    }
  },
  
  deleteTutor: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'tutores', id));
    } catch (error) {
      console.error("Erro ao deletar tutor:", error);
      throw error;
    }
  },
  
  getTutoresBySearch: async (searchTerm: string): Promise<Tutor[]> => {
    try {
      const tutoresSnapshot = await getDocs(collection(db, 'tutores'));
      const tutores = tutoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Tutor[];
      
      return tutores.filter(tutor => 
        tutor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.cpf.includes(searchTerm) ||
        tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Erro ao buscar tutores:", error);
      throw error;
    }
  }
};
