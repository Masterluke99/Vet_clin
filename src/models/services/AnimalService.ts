import { db } from '../../firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { Animal } from '../types/AnimalTypes';

export const AnimalService = {
  // Buscar todos os animais
  getAnimais: async (tutores: { id: string, nome: string }[]) => {
    try {
      const animaisSnapshot = await getDocs(collection(db, 'animais'));
      return await Promise.all(animaisSnapshot.docs.map(async docAnimal => {
        const animalData = docAnimal.data();
        let tutorNome = 'Sem tutor';
        
        if (animalData.tutorId) {
          const tutorDoc = tutores.find(t => t.id === animalData.tutorId);
          tutorNome = tutorDoc ? tutorDoc.nome : 'Tutor não encontrado';
        }
        
        return { 
          id: docAnimal.id, 
          ...animalData, 
          tutor: tutorNome 
        } as Animal;
      }));
    } catch (error) {
      console.error("Erro ao buscar animais:", error);
      throw error;
    }
  },
  
  // Adicionar novo animal
  addAnimal: async (animal: Omit<Animal, 'id' | 'tutor'>) => {
    try {
      return await addDoc(collection(db, 'animais'), {
        ...animal,
        criadoEm: new Date()
      });
    } catch (error) {
      console.error("Erro ao cadastrar animal:", error);
      throw error;
    }
  },
  
  // Atualizar animal existente
  updateAnimal: async (id: string, animal: Partial<Animal>) => {
    try {
      const animalRef = doc(db, 'animais', id);
      await updateDoc(animalRef, animal as DocumentData);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar animal:", error);
      throw error;
    }
  },
  
  // Excluir animal
  deleteAnimal: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'animais', id));
      return true;
    } catch (error) {
      console.error("Erro ao excluir animal:", error);
      throw error;
    }
  }
};
