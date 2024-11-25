import { API_URL } from '@/app/constants';
import axios from 'axios';
import { useQuery } from 'react-query';

const useBlogs = () => {
  const { data, error, isLoading } = useQuery('blogs', async () => {
    try {
      const response = await axios.get(`${API_URL}/blog/all`);

      return response.data.data;
    } catch (error) {
      console.error(error);
    }
  });

  return { data, error, isLoading };
};

export default useBlogs;
