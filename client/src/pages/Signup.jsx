import React, { useState } from "react";
import { useForm } from "react-hook-form";
import googleIcon from "../assets/images/google_icon.svg";
import loaderIcon from "../assets/images/loader_icon2.svg";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);
  const { setIsLoggedIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", data, {
        showToast: true,
      });
      console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true);
      navigate("/home");

      // toast.success("Account created successfully!");
      // setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused(null);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await userInfoResponse.json();

        // Send to your backend
        const userData = {
          name: userInfo.name,
          email: userInfo.email,
          googleId: userInfo.sub,
          picture: userInfo.picture,
          role: "", // You might want to show a modal to select role
        };

        const response = await axiosInstance.post(
          "/api/auth/google-signup",
          userData,
          { showToast: true }
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        navigate("/home");
      } catch (error) {
        console.error(error);
      }
    },
    onError: () => {
      toast.error("Google signup failed. Please try again.");
    },
  });

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3EDBD3] opacity-5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A7BF7] opacity-5 rounded-tr-full"></div>
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#FF6EC7] opacity-10 rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-[#3EDBD3] opacity-10 rounded-full"></div>

      <div className="w-full max-w-6xl bg-[#1E293B] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#283548]">
        {/* Left panel with branding */}
        <div className="bg-gradient-to-br from-[#0B1120] to-[#1E293B] md:w-2/5 p-10 hidden md:flex md:flex-col md:justify-between relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-[#4A7BF7] to-[#FF6EC7] opacity-10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-[#0B1120] opacity-20"></div>

            {/* Grid lines for decoration */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-full w-px bg-gradient-to-b from-transparent via-[#3EDBD3] to-transparent opacity-5"
                ></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-4 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-gradient-to-r from-transparent via-[#4A7BF7] to-transparent opacity-5"
                ></div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-wider text-[#3EDBD3] mb-2 font-sans">
              PayCraft
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] mb-6"></div>
            <h2 className="text-2xl font-light text-[#F8FAFC] leading-relaxed mb-6">
              Digital platform for developers to showcase their work
            </h2>
            <p className="text-[#94A3B8] text-lg">
              For the developers, by the developers
            </p>
          </div>

          <div className="relative z-10">
            <div className="flex space-x-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#283548] hover:bg-[#3EDBD3] hover:text-[#0F172A] flex items-center justify-center transition-all duration-300 cursor-pointer text-[#F8FAFC]">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#283548] hover:bg-[#4A7BF7] hover:text-[#0F172A] flex items-center justify-center transition-all duration-300 cursor-pointer text-[#F8FAFC]">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.91 4.91 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548z" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#283548] hover:bg-[#FF6EC7] hover:text-[#0F172A] flex items-center justify-center transition-all duration-300 cursor-pointer text-[#F8FAFC]">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm">
              © 2025 Codexa.io. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right panel with form */}
        <div className="w-full md:w-3/5 py-12 px-6 md:px-16 relative">
          {/* Loading overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-[#0F172A] bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#3EDBD3] border-r-[#4A7BF7] animate-spin"></div>
                <p className="mt-4 text-[#F8FAFC] font-medium">
                  Creating your account...
                </p>
              </div>
            </div>
          )}

          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">
                Welcome to PayCraft 👋
              </h2>
              <p className="text-[#94A3B8]">
                Create your account and start showcasing your work
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Name field */}
              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-[#F8FAFC]"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div
                  className={`relative rounded-lg border ${
                    errors.name
                      ? "border-red-500 bg-red-900 bg-opacity-10"
                      : focused === "name"
                      ? "border-[#3EDBD3] bg-[#3EDBD3] bg-opacity-5"
                      : "border-[#283548] bg-[#0F172A] bg-opacity-50"
                  } overflow-hidden transition-all duration-200`}
                >
                  <input
                    className="w-full bg-transparent px-4 py-3 outline-none text-[#F8FAFC] placeholder-[#94A3B8]"
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    {...register("name", {
                      required: { value: true, message: "Name is required" },
                      maxLength: { value: 50, message: "Name is too long" },
                    })}
                  />
                  {focused === "name" && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-[#3EDBD3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center mt-1">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-[#F8FAFC]"
                  htmlFor="role"
                >
                  Sign up as
                </label>
                <div
                  className={`relative rounded-lg border ${
                    errors.role
                      ? "border-red-500 bg-red-900 bg-opacity-10"
                      : focused === "role"
                      ? "border-[#4A7BF7] bg-[#4A7BF7] bg-opacity-5"
                      : "border-[#283548] bg-[#0F172A] bg-opacity-50"
                  } overflow-hidden transition-all duration-200`}
                >
                  <select
                    className="w-full bg-transparent px-4 py-3 outline-none text-[#F8FAFC] appearance-none"
                    id="role"
                    onFocus={() => handleFocus("role")}
                    onBlur={handleBlur}
                    {...register("role", {
                      required: {
                        value: true,
                        message: "Please select a role",
                      },
                    })}
                  >
                    <option value="" className="bg-[#0F172A]">
                      Select a role
                    </option>
                    <option value="freelancer" className="bg-[#0F172A]">
                      Freelancer
                    </option>
                    <option value="employer" className="bg-[#0F172A]">
                      Employer
                    </option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-[#94A3B8]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
                {errors.role && (
                  <p className="text-red-400 text-sm flex items-center mt-1">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-[#F8FAFC]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div
                  className={`relative rounded-lg border ${
                    errors.email
                      ? "border-red-500 bg-red-900 bg-opacity-10"
                      : focused === "email"
                      ? "border-[#3EDBD3] bg-[#3EDBD3] bg-opacity-5"
                      : "border-[#283548] bg-[#0F172A] bg-opacity-50"
                  } overflow-hidden transition-all duration-200`}
                >
                  <input
                    className="w-full bg-transparent px-4 py-3 outline-none text-[#F8FAFC] placeholder-[#94A3B8]"
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    {...register("email", {
                      required: { value: true, message: "Email is required" },
                      pattern: {
                        value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {focused === "email" && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-[#3EDBD3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm flex items-center mt-1">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="block text-sm font-medium text-[#F8FAFC]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div
                  className={`relative rounded-lg border ${
                    errors.password
                      ? "border-red-500 bg-red-900 bg-opacity-10"
                      : focused === "password"
                      ? "border-[#FF6EC7] bg-[#FF6EC7] bg-opacity-5"
                      : "border-[#283548] bg-[#0F172A] bg-opacity-50"
                  } overflow-hidden transition-all duration-200`}
                >
                  <input
                    className="w-full bg-transparent px-4 py-3 outline-none text-[#F8FAFC] placeholder-[#94A3B8]"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Password is required",
                      },
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must include uppercase, lowercase, number and special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#FF6EC7] transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-400 text-sm flex items-center mt-1">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Must be at least 8 characters with uppercase, lowercase,
                    number and special character
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isValid
                    ? "bg-gradient-to-r from-[#3EDBD3] to-[#4A7BF7] text-[#0F172A] hover:shadow-lg hover:shadow-[#3EDBD3]/20 transform hover:-translate-y-1"
                    : "bg-[#283548] text-[#94A3B8] cursor-not-allowed"
                }`}
                type="submit"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0F172A]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute border-t border-[#283548] w-full"></div>
                <div className="relative bg-[#1E293B] px-4 text-sm text-[#94A3B8]">
                  or continue with
                </div>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={() => handleGoogleSignup()}
                className="w-full flex items-center justify-center border border-[#283548] py-3 px-4 rounded-lg text-[#F8FAFC] font-medium hover:bg-[#283548] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md hover:shadow-[#FF6EC7]/10 group"
              >
                <img
                  className="w-5 h-5 mr-3 filter invert"
                  src={googleIcon}
                  alt="Google icon"
                />
                <span className="group-hover:text-[#FF6EC7] transition-colors duration-300">
                  Continue with Google
                </span>
              </button>

              {/* Login link */}
              <p className="mt-6 text-center text-[#94A3B8]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#3EDBD3] hover:text-[#4A7BF7] font-medium transition-colors"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
