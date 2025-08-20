"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

export default function SignupPage() {
  const { t } = useTranslation("common");


  useEffect(() => {
    document.title = t("signup.pagetitle");
  }, []);


  const router = useRouter();
  const { login } = useAuth();

  // State for input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State for validation errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // State to track if an input field has been "touched" (interacted with)
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Function to validate name
  const validateName = (nameValue) => {
    if (!nameValue.trim()) {
      setNameError(t("signup.errorEmptyName"));
      return false;
    }
    setNameError("");
    return true;
  };

  // Function to validate email
  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      setEmailError(t("signup.errorEmptyEmail"));
      return false;
    }
    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      setEmailError(t("signup.errorInvalidEmail"));
      return false;
    }
    setEmailError("");
    return true;
  };

  // Function to validate password
  const validatePassword = (passwordValue) => {
    if (!passwordValue.trim()) {
      setPasswordError(t("signup.errorEmptyPassword"));
      return false;
    }
    // IMPORTANT: Ensure this matches your backend's password length requirement.
    // Your backend previously had < 9, but your client-side now has < 6.
    // For consistency, I will assume 8 characters is the minimum as per earlier discussions.
    if (passwordValue.length < 6) {
      setPasswordError(t("signup.errorShortPassword"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Handle changes for each input with immediate validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    // Clear the specific "Email already exists" error when email changes
    if (emailError.includes(t("signup.errorEmailExists"))) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine if the form is valid and button should be enabled
  const isFormValid = useMemo(() => {
    const nameIsValid = validateName(name);
    const emailIsValid = validateEmail(email);
    const passwordIsValid = validatePassword(password);
    return nameIsValid && emailIsValid && passwordIsValid;
  }, [name, email, password]);


  const handleNext = async (e) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);

    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!nameValid || !emailValid || !passwordValid) {
      toast.error(t("signup.errorFormInvalid"));
      return;
    }

    try {
      const userData = {
        name: name,
        email: email,
        password: password,
      };

      const res = await axios.post(
        "/api/auth/signup",
        userData
      );

      const data = res.data;

      if (res.status === 201) {
        console.log(data);
        login(data.token);

        toast.success(data.success);
        router.push(`/signupbaby`);
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const backendError = err.response.data.error;
        toast.error(backendError || t("signup.errorUnknown"));


        if (backendError && backendError.includes("Email already exists")) {
          // Set the specific error message to be rendered with the link
          setEmailError(t("signup.errorNetwork"));
          setEmailTouched(true);
        }
      } else {
        toast.error(t("signup.emailLabel"));
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 to-pink-100">
      <form
        onSubmit={handleNext}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-pink-600">
          {t("signup.title")}
        </h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder={t("signup.namePlaceholder")}
            value={name}
            onChange={handleNameChange}
            onBlur={() => setNameTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${(nameError && nameTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
            `}
          />
          {(nameError && nameTouched) && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder={t("signup.emailPlaceholder")}
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setEmailTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
              ${(emailError && emailTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
            `}
          />
          {(emailError && emailTouched) && (
            <p className="text-red-500 text-sm mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>

              {emailError.includes("Email already exists") ? (
                <Trans i18nKey="signup.loginInstead" t={t} components={[
                  <span
                    onClick={() => router.push("/Login")}
                    className="text-pink-600 italic cursor-pointer hover:underline font-medium hover:text-pink-700 transition-colors duration-300"
                  />
                ]}
                />
              ) : (
                emailError
              )}
            </p>
          )}
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setPasswordTouched(true)}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${(passwordError && passwordTouched) ? 'border-red-500 focus:ring-red-400' : 'border-pink-300 focus:ring-pink-400'}
              `}
          />

          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/3 translate-y-[-50%]  cursor-pointer text-gray-500"
            style={{ userSelect: "none" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
          <p className="text-[11px] mt-1 text-gray-700 italic"> {t("signup.passwordNote")}</p>
          {(passwordError && passwordTouched) && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>

        <p className="text-center text-sm text-gray-500 mb-4">
          {t("signup.privacyNotice")}
        </p>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform
              ${isFormValid
              ? "bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-pink-200"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
            `}
          style={{
            boxShadow: isFormValid
              ? "0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          {isFormValid ? t("signup.submitButton") : t("signup.submitButtonDisabled")}
        </button>
      </form>
    </div>
  );
}
