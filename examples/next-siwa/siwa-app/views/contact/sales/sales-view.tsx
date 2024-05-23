"use client";

import axios from "axios";
import { FadeIn } from "../FadeIn";
import { ContactCard } from "../ContactCard";
import { SalesSidebar } from "../SalesSidebar";
import { LandingPageGlobalStyles } from "../GlobalStyles";
import { cn } from "@/dashboard/lib/utils"
import styles from "../index.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SalesView() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" }); // Validation mode set to onBlur
  const [show, setShow] = useState(false);
  const router = useRouter();

  const formData = watch();

  const formSubmit = async (data) => {
    try {
      const postData = {
        ...data,
        type: "sales",
      };

      const response = await axios.post(
        "https://formspree.io/f/moqovyev",
        postData,
      );
      console.log(response);
      router.push("/confirm?type=sales");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <LandingPageGlobalStyles />
      <div>
        <FadeIn
          className={cn(
            "z-10 flex h-full w-full flex-col items-center justify-center",
          )}
        >
          <div
            className={cn(
              "z-10 flex h-full w-full flex-col items-center justify-center",
              styles.salesContainer,
            )}
          >
            <h1 className="h1-custom mt-12 w-full bg-gradient-to-b from-black/80 to-black bg-clip-text text-center text-5xl font-bold leading-tight  text-transparent dark:from-white dark:to-[#AAAAAA] md:!w-full lg:!mt-12 lg:text-6xl xl:leading-snug">
              Talk to our Sales team
            </h1>
            <div className="l-spacing font-space-grotesk mb-12 mt-4 max-h-[112px] text-center  text-xl text-[#666666] dark:text-[#888888] md:max-h-[96px] md:text-2xl">
              We'll help you find the right plan and pricing for your business.
            </div>
            <div className="mlg:!flex-row container z-10 flex w-full flex-col items-center justify-center gap-6 sm:mx-0 md:mb-0 lg:!translate-y-0">
              <ContactCard className=" sm:w-full md:w-auto">
                <form
                  className="w-full max-w-lg"
                  onSubmit={handleSubmit(formSubmit)}
                >
                  <div className="sm:grid-cols- grid grid-cols-1 gap-x-8 gap-y-4">
                    <label className="flex flex-col">
                      <div className="mb-2 block text-xs text-secondary dark:text-[#888888]">
                        Company Email
                      </div>
                      <div className="rust-input-container">
                        <input
                          className={cn(
                            errors.email && styles.inputErrorInput,
                            "rust-input text-md rust-block rust-w-full rust-appearance-none rust-rounded-lg rust-px-3 rust-py-2 rust-transition-colors rust-text-base rust-leading-tight md:rust-text-sm contrast-more:rust-border contrast-more:rust-border-current border",
                          )}
                          type="email"
                          {...register("email", {
                            required: "Email address is required.",
                            pattern: {
                              value:
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="Email"
                        />
                        {errors.email && (
                          <div className={cn(styles.inputErrorContainer)}>
                            <div aria-hidden="true">
                              <AlertCircleIcon
                                width="16"
                                height="16"
                                className={cn(styles.inputErrorIcon)}
                              />
                            </div>
                            <p className={cn(styles.inputErrorText)}>
                              {errors.email.message &&
                                errors.email.message.toString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                    <label className="flex flex-col">
                      <div className="mb-2 block text-xs text-secondary dark:text-[#888888] ">
                        How Can We Help?
                      </div>
                      <div className="rust-input-container">
                        <textarea
                          {...register("message", {
                            required: "Message is required.",
                          })}
                          name="message"
                          spellCheck="false"
                          rows={8}
                          className="rust-textarea text-md rust-block rust-w-full rust-appearance-none rust-rounded-lg rust-px-3 rust-py-2 rust-transition-colors rust-text-base rust-leading-tight md:rust-text-sm contrast-more:rust-border contrast-more:rust-border-current border"
                        ></textarea>
                      </div>
                    </label>
                    <div
                      className={cn(
                        styles.submitRow,
                        "flex items-center justify-end",
                      )}
                    >
                      <button
                        data-rust-button
                        disabled={!isValid}
                        type="submit"
                        className={cn(
                          styles.submitButton,
                          "w-25 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 flex items-center justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm",
                        )}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </ContactCard>

              <SalesSidebar>
                <div className={cn(styles["text-wrapper"])}>hello world</div>
                <div>Hello wowoesd</div>
              </SalesSidebar>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
