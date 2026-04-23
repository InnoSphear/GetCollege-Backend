import { ImageKit } from "@imagekit/nodejs";

let imageKit;

export const initImageKit = () => {
  imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
  });
  return imageKit;
};

export const getImageKit = () => imageKit;