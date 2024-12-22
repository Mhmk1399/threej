"use client";
import ThreeScene from "@/components/ThreeScene";
import TypingEffect from "@/components/typingHeroSection";
import MusicPlayer from "@/components/musicPlayer";
import BaseScene from "@/components/BaseScene";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    document.title = "تومک | بهترین سرویس های حرفه ای برای کسب و کارهای آنلاین";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "در تومک، ما به شما کمک می‌کنیم تا در دنیای دیجیتال بدرخشید! با ارائه خدمات جامع شامل طراحی وب، سئو، تولید محتوا، گرافیک و آنالیز داده، تیم ما آماده است تا با راهکارهای نوآورانه و تخصصی، نیازهای کسب‌وکار شما را برآورده کند."
      );
    }
  }, []);

  return (
    <div dir="rtl">
      <ThreeScene />
      <div className="relative z-1 text-dark mt-8 px-8 justify-center"></div>
      <h1 className="mx-auto text-base font-thin text-center text-white mt-32 lg:text-base">
        <TypingEffect
          pause={1500}
          speed={50}
          words={["تا فروش دیجیتال فقط یک کلیک بر روی تاس زیر فاصله دارید !"]}
        />
      </h1>
      <div
        className="flex justify-center  z-1 items-center my-44"
        style={{ height: "50px", width: "100%" }}
      >
        {/* <DiceScene /> */}
        <BaseScene
          modelPath={"/assets/models/scene33.gltf"}
          redirectUrl={"/servicess"}
        />
      </div>
      <MusicPlayer />

      {/* Enhanced Styles */}
    </div>
  );
};

export default Page;
