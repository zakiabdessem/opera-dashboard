import { API_URL } from '@/app/constants';
import axios from 'axios';
import { useQuery } from 'react-query';

export const useProducts = () => {
  const { data, error, isLoading } = useQuery('products', async () => {
    try {
      const response = await axios.get(`${API_URL}/product/all`);

      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  });

  return { data, error, isLoading };
};
