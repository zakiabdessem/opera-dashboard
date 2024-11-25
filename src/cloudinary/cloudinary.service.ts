import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { v2 } from 'cloudinary';

export class CloudinaryService {
  async uploadImage(
    title: string,
    base64String: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.config({
        cloud_name: 'dlua23dqn', // TODO: Make it .env
        api_key: '289241747476532',
        api_secret: 'lWQYHDaS2t04pkWEaj0EzWVwFJw',
      });

      v2.uploader.upload(
        base64String,
        {
          folder: `opera/${title}`,
          use_filename: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async uploadPdf(
    title: string,
    base64String: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.config({
        cloud_name: 'dlua23dqn', // TODO: Make it .env
        api_key: '289241747476532',
        api_secret: 'lWQYHDaS2t04pkWEaj0EzWVwFJw',
      });

      v2.uploader.upload(
        base64String,
        {
          format: 'pdf',
          folder: `documents/${title}`,
          use_filename: true,
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
    });
  }
}
