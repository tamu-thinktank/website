"use client";
import type { ChangeEvent, FormEvent } from "react";
import React, { useState } from "react";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  uin: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    uin: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    uin: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stateMessage, setStateMessage] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUIN = (uin: string) => {
    return /^\d{9,}$/.test(uin);
  };

  const validateMessage = (message: string) => {
    const wordCount = message.trim().split(/\s+/).length;
    return wordCount <= 250;
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email format. Must contain @ and .",
          }));
        }
        break;
      case "uin":
        if (!validateUIN(value)) {
          setErrors((prev) => ({
            ...prev,
            uin: "UIN must be at least 9 digits long.",
          }));
        }
        break;
      case "message":
        if (!validateMessage(value)) {
          setErrors((prev) => ({
            ...prev,
            message: "Message cannot exceed 250 words.",
          }));
        }
        break;
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      console.error("EmailJS environment variables are not defined.");
      setStateMessage("Unable to send message. Configuration error.");
      return;
    }

    if (
      !validateEmail(formData.email) ||
      !validateUIN(formData.uin) ||
      !validateMessage(formData.message)
    ) {
      setStateMessage("Please fix the errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          uin: formData.uin,
          subject: formData.subject,
          message: formData.message,
        },
        userId,
      );

      console.log(result.text);
      setStateMessage("Message sent successfully!");
      setFormData({ name: "", email: "", uin: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send email:", error);
      setStateMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStateMessage(""), 5000);
    }
  };

  const isFormValid =
    !errors.email &&
    !errors.uin &&
    !errors.message &&
    formData.name &&
    formData.email &&
    formData.uin &&
    formData.subject &&
    formData.message;

  return (
    <div className="bg-[#1A1A1A] p-3 text-sm text-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full border-b border-gray-600 bg-transparent px-1 py-1.5 placeholder-gray-400 transition duration-300 focus:border-white focus:ring-0 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
              required
              className="w-full border-b border-gray-600 bg-transparent px-1 py-1.5 placeholder-gray-400 transition duration-300 focus:border-white focus:ring-0 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="uin" className="sr-only">
              UIN
            </label>
            <input
              type="text"
              name="uin"
              id="uin"
              value={formData.uin}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="UIN"
              required
              className="w-full border-b border-gray-600 bg-transparent px-1 py-1.5 placeholder-gray-400 transition duration-300 focus:border-white focus:ring-0 focus:outline-none"
            />
            {errors.uin && (
              <p className="mt-1 text-xs text-red-500">{errors.uin}</p>
            )}
          </div>
          <div>
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <select
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full appearance-none border-b border-gray-600 bg-transparent px-1 py-2 text-gray-400 transition duration-300 focus:border-white focus:text-white focus:ring-0 focus:outline-none"
            >
              <option value="" disabled className="bg-[#1A1A1A] text-gray-400">
                Select Subject
              </option>
              <option value="App" className="bg-[#1A1A1A] text-gray-400">
                Applications
              </option>
              <option value="Int" className="bg-[#1A1A1A] text-gray-400">
                Interviews
              </option>
              <option value="Com" className="bg-[#1A1A1A] text-gray-400">
                Design Challenges
              </option>
              <option value="Des" className="bg-[#1A1A1A] text-gray-400">
                Design Teams
              </option>
              <option value="Wor" className="bg-[#1A1A1A] text-gray-400">
                Workshops
              </option>
              <option value="Opp" className="bg-[#1A1A1A] text-gray-400">
                Opportunities
              </option>
              <option value="Oth" className="bg-[#1A1A1A] text-gray-400">
                Other
              </option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Message"
            required
            className="w-full resize-none border-b border-gray-600 bg-transparent px-1 py-1.5 placeholder-gray-400 transition duration-300 focus:border-white focus:ring-0 focus:outline-none"
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full rounded-md bg-white px-3 py-1.5 text-sm text-[#1A1A1A] transition duration-300 hover:bg-gray-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1A1A1A] focus:outline-none"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
      {stateMessage && (
        <p
          className={`mt-2 text-xs ${
            stateMessage.includes("successfully")
              ? "text-green-400"
              : "text-red-400"
          } text-center`}
        >
          {stateMessage}
        </p>
      )}
    </div>
  );
};

export default ContactForm;
