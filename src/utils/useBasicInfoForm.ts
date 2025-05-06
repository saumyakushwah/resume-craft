import { useForm } from "@mantine/form";
import { isValidPhoneNumber } from "react-phone-number-input";

export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const useBasicInfoForm = () =>
  useForm<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },

    validate: {
      firstName: (value) => {
        if (!value) return "First name is required";
        if (value.length < 3) return "First name must be at least 3 characters";
        return null;
      },
      lastName: (value) => {
        if (!value) return "Last name is required";
        if (value.length < 3) return "Last name must be at least 3 characters";
        return null;
      },
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return null;
      },
      phone: (value) => {
        if (!value) return "Phone number is required";
        if (!isValidPhoneNumber(value)) return "Invalid phone number format";
        return null;
      },
    },

    validateInputOnBlur: true,
  });
