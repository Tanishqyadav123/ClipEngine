"use client";

import Image, { type ImageProps } from "next/image";
// import { Button } from "@repo/ui/button";
// import styles from "./page.module.css";
import { useEffect } from "react";
import axios from "axios";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const callApiHandler = async () => {
    const res = await axios.get(`http://localhost:8000/api/video/all`);
    console.log(res.data);
  };
  useEffect(() => {
    callApiHandler();
  }, []);

  return <div>Home Page...</div>;
}
