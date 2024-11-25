import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Layout from '../Layout';
import { MAIN_DASHBOARD_URL } from '@/app/constants';

import { Checkbox } from '@/components/ui/checkbox';
import moment from 'moment';
import { DeleteIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { instance } from '@/app/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Showroom } from '@/types/showrooms';
import useShowrooms from '@/hooks/showrooms/useShowrooms';
// TODO: Add table pagination

export default function Showrooms() {
  // const [sortBy, setSortBy] = useState("");
  const { data: showrooms } = useShowrooms();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <a href={`${MAIN_DASHBOARD_URL}/showroom/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Create Showroom
          </Button>
        </a>
      </div>
      <div className="bg-white rounded-md">
        {showrooms && <ProductTable showrooms={showrooms} />}
      </div>
    </Layout>
  );
}

function ProductTable({ showrooms }: { showrooms: Showroom[] }) {
  const navigate = useNavigate();

  const handleDeleteShowroom = async (id: string) => {
    await instance
      .post('showroom/delete', {
        id,
      })
      .then(() => {
        toast.success(`Showroom is deleted`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate(`${MAIN_DASHBOARD_URL}/showroom`);
        }, 1000);
      });
  };

  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your showrooms.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>

          <TableHead>CreatedAt</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Image</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {showrooms &&
          showrooms.length > 0 &&
          showrooms.map((showroom) => {
            const date = moment(showroom.createdAt.toString()).format('LLL');
            return (
              <TableRow key={showroom._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 font-medium">
                  {showroom.title.toUpperCase()}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  <img
                    src={showroom.showroom_img}
                    alt={showroom._id + 'Image'}
                    className="w-12 h-12"
                  />
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for showroom
                  }
                  <Button
                    onClick={() => handleDeleteShowroom(showroom._id)}
                    variant="destructive"
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
