import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AtendimentoRecente {
  id: string;
  data: any; // Usando any para lidar com diferentes formatos de data do Firestore
  animal_id: string;
  animal_nome?: string;
  servico_id: string;
  observacoes?: string;
}

const RecentActivityWidget: React.FC = () => {
  const [carregando, setCarregando] = useState(true);
  const [atendimentos, setAtendimentos] = useState<AtendimentoRecente[]>([]);
  const [servicos, setServicos] = useState<{[id: string]: string}>({});
  
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'servicos'));
        const map: {[id: string]: string} = {};
        querySnapshot.forEach(doc => { map[doc.id] = doc.data().nome; });
        setServicos(map);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      }
    };
    
    const fetchRecentAtendimentos = async () => {
      setCarregando(true);
      try {
        // Buscar atendimentos recentes
        const q = query(
          collection(db, 'atendimentos'), 
          orderBy('data', 'desc'), 
          limit(5)
        );
        
        const atendimentosSnapshot = await getDocs(q);
        const atendimentosPromises = atendimentosSnapshot.docs.map(async (docSnapshot) => {
          const atendimentoData = docSnapshot.data();
          const atendimento: AtendimentoRecente = {
            id: docSnapshot.id,
            data: atendimentoData.data,
            animal_id: atendimentoData.animal_id,
            servico_id: atendimentoData.servico_id,
            observacoes: atendimentoData.observacoes || ''
          };
          
          // Buscar nome do animal
          try {
            const animalDocRef = doc(db, 'animais', atendimento.animal_id);
            const animalDocSnap = await getDoc(animalDocRef);
            if (animalDocSnap.exists()) {
              const animalData = animalDocSnap.data();
              atendimento.animal_nome = animalData.nome;
            }
          } catch (error) {
            console.error('Erro ao buscar dados do animal:', error);
          }
          
          return atendimento;
        });
        
        const atendimentosData = await Promise.all(atendimentosPromises);
        setAtendimentos(atendimentosData);
      } catch (error) {
        console.error('Erro ao buscar atendimentos recentes:', error);
      } finally {
        setCarregando(false);
      }
    };
    
    fetchServicos();
    fetchRecentAtendimentos();
  }, []);

  // Função para formatar data
  const formatarData = (data: any) => {
    try {
      if (data instanceof Date) {
        return format(data, 'dd/MM/yyyy', { locale: ptBR });
      }
      
      if (typeof data === 'string') {
        const dataObj = new Date(data);
        return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
      }
      
      // Verificar para timestamp do Firestore
      if (data && typeof data === 'object' && data.toDate && typeof data.toDate === 'function') {
        return format(data.toDate(), 'dd/MM/yyyy', { locale: ptBR });
      }
      
      return 'Data inválida';
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };
  
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      width: '100%'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        color: '#3f51b5',
        fontSize: '18px',
        fontWeight: 500
      }}>
        Atendimentos Recentes
      </h3>
      
      {carregando ? (
        <div style={{ padding: 20, textAlign: 'center' }}>
          Carregando...
        </div>
      ) : atendimentos.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center' }}>
          Nenhum atendimento recente encontrado.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ background: '#3f51b5', color: 'white' }}>
                <th style={{ padding: 12, textAlign: 'left' }}>Data</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Animal</th>
                <th style={{ padding: 12, textAlign: 'left' }}>Serviço</th>
              </tr>
            </thead>
            <tbody>
              {atendimentos.map((at, index) => (
                <tr key={at.id} style={{ background: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{formatarData(at.data)}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{at.animal_nome || 'Não identificado'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{servicos[at.servico_id] || 'Serviço não encontrado'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentActivityWidget;
