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
import { useProducts } from '@/hooks/products/useProducts';
import { Product } from '@/types/products';

// TODO: Add table pagination

export default function Announces() {
  // const [sortBy, setSortBy] = useState("");
  const { data: products } = useProducts();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <a href={`${MAIN_DASHBOARD_URL}/products/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Create Products
          </Button>
        </a>
      </div>
      <div className="bg-white rounded-md">
        {products && <ProductTable products={products} />}
      </div>
    </Layout>
  );
}

function ProductTable({ products }: { products: Product[] }) {
  const navigate = useNavigate();

  const handleDeleteAnnounce = async (id: string) => {
    await instance
      .post('product/delete', {
        id,
      })
      .then(() => {
        toast.success(`Product is deleted`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate(`${MAIN_DASHBOARD_URL}/products`);
        }, 1000);
      });
  };

  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your products.
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="w-[50px]"></TableHead>

          <TableHead>CreatedAt</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Pdf</TableHead>

          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products &&
          products.length > 0 &&
          products.map((product) => {
            const date = moment(product.createdAt.toString()).format('LLL');
            return (
              <TableRow key={product._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 font-medium">
                  {product.title.toUpperCase()}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  <img
                    src={product.product_img}
                    alt={product._id + 'Image'}
                    className="w-28 h-24 rounded-xl"
                  />
                </TableCell>

                <TableCell className="max-h-16 max-w-16">
                  <a
                    className="text-blue-600 font-sans font-semibold"
                    href={product.product_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for product
                  }
                  <Button
                    onClick={() => handleDeleteAnnounce(product._id)}
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
