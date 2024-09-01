"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NextImage } from "next/image";

export default function NewsDetails() {
  const [newsItem, setNewsItem] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setNewsItem(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNews();
  }, [id]);

  return <div> Hello from Page details</div>;
}
