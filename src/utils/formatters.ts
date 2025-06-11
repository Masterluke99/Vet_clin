// Funções utilitárias para formatação e manipulação de valores
export const formatCurrency = (value: number | undefined | null | string): string => {
  if (value === undefined || value === null) return "0,00";
  // Garantir que estamos trabalhando com um número
  const numValue = typeof value === "number" ? value : Number(value);
  // Verificar se é um número válido
  if (isNaN(numValue)) return "0,00";
  // Formatar com duas casas decimais e separador brasileiro
  return numValue.toFixed(2).replace(".", ",");
};

// Função para converter strings para números, com tratamento de erro
export const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  // Tentar converter para número
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};
