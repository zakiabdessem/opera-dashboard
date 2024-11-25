import { API_URL } from '@/app/constants';
import axios from 'axios';
import { useQuery } from 'react-query';

const useShowrooms = () => {
  const { data, error, isLoading } = useQuery('showroom', async () => {
    try {
      const response = await axios.get(`${API_URL}/showroom/all`);

      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  });

  return { data, error, isLoading };
};

export default useShowrooms;
