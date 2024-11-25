'use client';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/products/useProducts';
import { Textarea } from '@/components/ui/textarea';

//const MAX_FILE_SIZE = 100 * 1024 * 1024;

const formSchema = z.object({
  title: z.string(),
  detail: z.string(),
  product: z.string(),

  // blog_img: imageSchema,
  // blog_pdf: z.union([
  //   z
  //     .any()
  //     .refine((files) => {
  //       return files?.[0]?.size <= MAX_FILE_SIZE;
  //     }, `Max image size is 20MB.`)
  //     .refine(
  //       (files) => 'application/pdf'.includes(files?.[0]?.type),
  //       'Only .pdf format is supported.',
  //     ),
  //   z.string().url('Invalid URL format'),
  // ]),
});

export default function CreateAnnounce() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products } = useProducts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    // Set loading state
    dispatch({
      type: 'APP_SET_LOADING',
    });

    // Send POST request with announce_img as base64 string
    try {
      await instance.post('/announce/create', {
        ...data,
        withCredentials: true,
      });

      navigate(`${MAIN_DASHBOARD_URL}/announce`);
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
      <TitlePage>Create Announce</TitlePage>
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
                        placeholder="Titre de l'announce"
                        maxLength={256}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Titre de announce.</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="detail"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Content</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Detail de l'announce"
                        maxLength={256}
                        {...field}
                        className="textarea"
                      />
                    </FormControl>
                    <FormDescription>Detail de L'announce.</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Produit d'announce</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selectionner a produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {products &&
                            products.length > 0 &&
                            products?.map((product: any, index: number) => {
                              console.log(product);
                              return (
                                <SelectItem key={index} value={product._id}>
                                  <div className="flex justify-center items-center text-center">
                                    <img
                                      src={product.product_img}
                                      className="w-8 h-8 mr-2"
                                    />
                                    <p className="font-montserrat font-medium">
                                      {product.title}
                                    </p>
                                  </div>
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Select a product.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              {/* <div className="p-2">
                <FormField
                  control={form.control}
                  name="blog_img"
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
              </div> */}

              {/* PDF */}
              {/* <div className="p-2">
                <FormField
                  control={form.control}
                  name="blog_pdf"
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
              </div> */}
            </Form>
          </div>
          <Button className="m-5" type="submit" color="primary">
            Create Announce
          </Button>
        </div>
      </form>
    </Layout>
  );
}
