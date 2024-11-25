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
import useAnnounces from '@/hooks/announces/useAnnounces';
import type { Announce } from '@/types/announces';

export default function Announce() {
  // const [sortBy, setSortBy] = useState("");
  const { data: announces } = useAnnounces();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <a href={`${MAIN_DASHBOARD_URL}/announce/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Create Announce
          </Button>
        </a>
      </div>
      <div className="bg-white rounded-md">
        {announces && <AnnounceTable announces={announces} />}
      </div>
    </Layout>
  );
}

function AnnounceTable({ announces }: { announces: Announce[] }) {
  const navigate = useNavigate();

  const handleDeleteAnnounce = async (id: string) => {
    await instance
      .post('announce/delete', {
        id,
      })
      .then(() => {
        toast.success(`Announce is deleted`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate(`${MAIN_DASHBOARD_URL}/announce`);
        }, 1000);
      });
  };

  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your announces.
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
        {announces &&
          announces.length > 0 &&
          announces.map((announce) => {
            const date = moment(announce.createdAt.toString()).format('LLL');
            return (
              <TableRow key={announce._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 font-medium">
                  {announce.title.toUpperCase()}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  <img
                    src={announce.product.product_img}
                    alt={announce._id + 'Image'}
                    className="w-16 h-16"
                  />
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for announce
                  }
                  <Button
                    onClick={() => handleDeleteAnnounce(announce._id)}
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
