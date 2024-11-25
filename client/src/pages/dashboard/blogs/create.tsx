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
import { isValidURL } from '@/validator/url';
import { imageSchema } from '@/validator/product';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string(),
  detail: z.string().optional(),
  blog_img: imageSchema,
});

export default function CreateBlog() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    // Check if the blog_img needs to be converted to base64
    if (!isValidURL(form.watch('blog_img'))) {
      const file = data.blog_img[0];

      // Convert File to base64 string using FileReader and Promise
      data.blog_img = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
          resolve(event?.target?.result); // Resolve with base64 string
        };

        reader.onerror = function () {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file); // Read file as base64
      });
    }

    console.log(data);

    // Set loading state
    dispatch({
      type: 'APP_SET_LOADING',
    });

    // Send POST request with blog_img as base64 string
    try {
      await instance.post('/blog/create', {
        ...data,
        withCredentials: true,
      });

      navigate(`${MAIN_DASHBOARD_URL}/blogs`);
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
      <TitlePage>Create Blog</TitlePage>
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
                        placeholder="Titre de l'blog"
                        maxLength={256}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Titre de l'blog.</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                name="detail"
                render={({ field }) => (
                  <FormItem className="max-w-72">
                    <FormLabel>Detail</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Detail de l'blog"
                        maxLength={525}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Detail de l'blog.</FormDescription>
                  </FormItem>
                )}
              />

              {/* Image */}
              <div className="p-2">
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
                              className="hidden"
                              id="fileInput"
                              onBlur={field.onBlur}
                              name={field.name}
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                setSelectedImage(e.target.files?.[0] || null);
                              }}
                              ref={field.ref}
                            />

                            <label
                              htmlFor="fileInput"
                              className=" text-neutral-90  rounded-md cursor-pointer inline-flex items-center"
                            >
                              <span className="whitespace-nowrap">
                                {selectedImage?.name &&
                                !isValidURL(form.watch('blog_img'))
                                  ? selectedImage?.name
                                  : 'choose your image'}
                              </span>
                            </label>
                          </Button>
                        </FormControl>
                        <FormDescription>
                          2mb max, PNG, JPG, JPEG, WEBP
                        </FormDescription>

                        <FormMessage />
                      </FormItem>

                      <FormItem className="flex flex-col max-w-64">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="https://example.com/"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                  )}
                />
              </div>
            </Form>
          </div>
          <Button className="m-5" type="submit" color="primary">
            Create Blog
          </Button>
        </div>
      </form>
    </Layout>
  );
}
