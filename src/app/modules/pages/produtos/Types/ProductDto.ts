export interface ProductDto {
  codigo_barras: string;
  nome_item: string;
  modelo: string;
  id_categoria: string;
  id_marca: string;
  preco: number;
  quantidade: number;
  quantidade_minima: number;
  descricao: string;

  tamanho?: string;
  codigo_sku?: string;
  cor?: string;
  data?: Date;
  observacoes?: string;
}
