import { TitlePage } from '@/components/PageTitle';
import Layout from '../Layout';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { instance } from '@/app/axios';
import { useNavigate } from 'react-router-dom';
import { MAIN_DASHBOARD_URL } from '@/app/constants';
import { useDispatch } from '@/redux/hooks';
import { imageSchema } from '@/validator/product';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { categories } from '../../../../category';

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const formSchema = z.object({
  title: z.string(),
  product_img: imageSchema,
  product_pdf: z.union([
    z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 20MB.`)
      .refine(
        (files) => 'application/pdf'.includes(files?.[0]?.type),
        'Only .pdf format is supported.',
      ),
    z.string().url('Invalid URL format'),
  ]),
  category: z.string(),
});

export default function CreateProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    // Check if the announce_img needs to be converted to base64
    let fileImage = data.product_img[0];
    let filePdf = data.product_pdf[0];

    // Convert File to base64 string using FileReader and Promise
    data.product_img = await new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = function (event) {
        resolve(event?.target?.result); // Resolve with base64 string
      };

      reader.onerror = function () {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(fileImage); // Read file as base64
    });

    data.product_pdf = await new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = function (event) {
        resolve(event?.target?.result); // Resolve with base64 string
      };

      reader.onerror = function () {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(filePdf); // Read file as base64
    });

    // Set loading state
    dispatch({
      type: 'APP_SET_LOADING',
    });

    // Send POST request with announce_img as base64 string
    try {
      await instance.post('/product/create', {
        ...data,
        withCredentials: true,
      });

      navigate(`${MAIN_DASHBOARD_URL}/products`);
    } catch (error) {
      dispatch({
        type: 'APP_SET_ERROR',
        payload: {
          error: 'something went wrong',
        },
      });
    }

    // Clear loading state
    dispatch({
      type: 'APP_CLEAR_LOADING',
    });
  };

  return (
    <Layout>
      <TitlePage>Create Product</TitlePage>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-lg:flex-col gap-2"
      >
        <div className="bg-white rounded-md w-full">
          <div className="p-5 flex flex-col justify-between">
            <Form {...form}>
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Titre</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Titre de produit"
                        maxLength={256}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Titre de produit.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Image */}
              <div className="p-2">
                <FormField
                  control={form.control}
                  name="product_img"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <FormItem className="flex flex-col max-w-64">
                        <FormLabel>Image*</FormLabel>
                        <FormControl>
                          <Button size="lg" type="button">
                            <input
                              type="file"
                              id="fileInput"
                              onBlur={field.onBlur}
                              name={field.name}
                              onChange={(e) => field.onChange(e.target.files)}
                              ref={field.ref}
                            />
                          </Button>
                        </FormControl>
                        <FormDescription>
                          2mb max, PNG, JPG, JPEG, WEBP
                        </FormDescription>

                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              {/* PDF */}
              <div className="p-2">
                <FormField
                  control={form.control}
                  name="product_pdf"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <FormItem className="flex flex-col max-w-64">
                        <FormLabel>PDF*</FormLabel>
                        <FormControl>
                          <Button size="lg" type="button">
                            <input
                              type="file"
                              id="fileInput"
                              onBlur={field.onBlur}
                              name={field.name}
                              onChange={(e) => field.onChange(e.target.files)}
                              ref={field.ref}
                            />
                          </Button>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category: string) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select a category for the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>
          <Button className="m-5" type="submit" color="primary">
            Create Product
          </Button>
        </div>
      </form>
    </Layout>
  );
}
