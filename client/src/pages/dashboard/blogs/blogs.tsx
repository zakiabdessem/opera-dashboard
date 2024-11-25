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
import useBlogs from '@/hooks/blogs/useBlogs';
import { Blog } from '@/types/blogs';
// TODO: Add table pagination

export default function Blogs() {
  // const [sortBy, setSortBy] = useState("");
  const { data: blogs } = useBlogs();

  return (
    <Layout>
      <div className="flex max-sm:flex-col justify-between p-2">
        <a href={`${MAIN_DASHBOARD_URL}/blog/create`}>
          <Button>
            <PlusIcon className="mr-2" width={16} height={16} />
            Create Blog
          </Button>
        </a>
      </div>
      <div className="bg-white rounded-md">
        {blogs && <ProductTable blogs={blogs} />}
      </div>
    </Layout>
  );
}

function ProductTable({ blogs }: { blogs: Blog[] }) {
  const navigate = useNavigate();

  const handleDeleteBlog = async (id: string) => {
    await instance
      .post('blog/delete', {
        id,
      })
      .then(() => {
        toast.success(`Blog is deleted`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate(`${MAIN_DASHBOARD_URL}/blog`);
        }, 1000);
      });
  };

  return (
    <Table>
      <TableCaption className="p-2">
        A table for all of your blogs.
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
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => {
            const date = moment(blog.createdAt.toString()).format('LLL');
            return (
              <TableRow key={blog._id}>
                <TableCell className="max-h-16 max-w-16">
                  <Checkbox checked={false} />
                </TableCell>
                <TableCell className="font-medium text-gray-400">
                  {date}
                </TableCell>
                <TableCell className="max-h-16 max-w-16 font-medium">
                  {blog.title.toUpperCase()}
                </TableCell>
                <TableCell className="max-h-16 max-w-16">
                  <img
                    src={blog.blog_img}
                    alt={blog._id + 'Image'}
                    className="w-12 h-12"
                  />
                </TableCell>

                <TableCell className="text-right">
                  {
                    // Todo : Add model for blog
                  }
                  <Button
                    onClick={() => handleDeleteBlog(blog._id)}
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
