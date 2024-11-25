import { API_URL } from '@/app/constants';
import axios from 'axios';
import { useQuery } from 'react-query';

const useAnnounces = () => {
  const { data, error, isLoading } = useQuery('announces', async () => {
    try {
      const response = await axios.get(`${API_URL}/announce/all`);

      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  });

  return { data, error, isLoading };
};

export default useAnnounces;
