import paohambuguer from '@/assets/pao-hamburger.jpg';
import carne from '@/assets/carne.jpg';
import queijo from '@/assets/queijo.jpg';
import bacon from '@/assets/bacon.jpg';
import alface from '@/assets/alface.jpg';
import tomate from '@/assets/tomate.jpg';
import cebola from '@/assets/cebola.jpg';
import batataFrita from '@/assets/batata-frita.jpg';

// Mapeamento de produtos para imagens
export const getProductImage = (productName: string): string => {
  const normalizedName = productName.toLowerCase().trim();
  
  if (normalizedName.includes('pão') || normalizedName.includes('pao')) {
    return paohambuguer;
  }
  if (normalizedName.includes('carne') || normalizedName.includes('hambúrguer') || normalizedName.includes('hamburger')) {
    return carne;
  }
  if (normalizedName.includes('queijo')) {
    return queijo;
  }
  if (normalizedName.includes('bacon')) {
    return bacon;
  }
  if (normalizedName.includes('alface')) {
    return alface;
  }
  if (normalizedName.includes('tomate')) {
    return tomate;
  }
  if (normalizedName.includes('cebola')) {
    return cebola;
  }
  if (normalizedName.includes('batata') || normalizedName.includes('frita')) {
    return batataFrita;
  }
  
  // Fallback para produtos não mapeados
  return paohambuguer;
};