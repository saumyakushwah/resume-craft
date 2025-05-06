import { useEffect } from "react";
import {
  TextInput,
  Group,
  Box,
  Stack,
  InputLabel,
  Flex,
  Text,
} from "@mantine/core";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "./index.module.scss";
import { storagePrefix } from "@/utils/storage";
import { UseFormReturnType } from "@mantine/form";
import { FormValues } from "@/utils/useBasicInfoForm";

export default function BasicInfoForm({
  form,
}: {
  form: UseFormReturnType<FormValues>;
}) {
  useEffect(() => {
    const savedFirstName = localStorage.getItem(`${storagePrefix}firstName`);
    const savedLastName = localStorage.getItem(`${storagePrefix}lastName`);
    const savedEmail = localStorage.getItem(`${storagePrefix}email`);
    const savedPhone = localStorage.getItem(`${storagePrefix}phone`);

    form.setValues({
      firstName: savedFirstName || "",
      lastName: savedLastName || "",
      email: savedEmail || "",
      phone: savedPhone || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const values = form.values;
    if (values.firstName)
      localStorage.setItem(`${storagePrefix}firstName`, values.firstName);
    if (values.lastName)
      localStorage.setItem(`${storagePrefix}lastName`, values.lastName);
    if (values.email)
      localStorage.setItem(`${storagePrefix}email`, values.email);
    if (values.phone)
      localStorage.setItem(`${storagePrefix}phone`, values.phone);
  }, [form.values]);

  return (
    <Box>
      <h3 className={styles.heading}>Basic Information</h3>
      <Stack gap={20}>
        <Group>
          <Flex w="419px" direction="column">
            <InputLabel>First Name</InputLabel>
            <TextInput
              placeholder="John"
              required
              className={`${styles.inputField} ${
                form.errors.firstName ? styles.errorBorder : ""
              }`}
              variant="unstyled"
              {...form.getInputProps("firstName")}
              error={null}
            />
            {form.errors.firstName && (
              <Text className={styles.errorText} size="xs" color="red">
                {form.errors.firstName}
              </Text>
            )}
          </Flex>
          <Flex w="419px" direction="column">
            <InputLabel>Last Name</InputLabel>
            <TextInput
              placeholder="Doe"
              required
              className={`${styles.inputField} ${
                form.errors.lastName ? styles.errorBorder : ""
              }`}
              variant="unstyled"
              {...form.getInputProps("lastName")}
              error={null}
            />
            {form.errors.lastName && (
              <Text className={styles.errorText} size="xs" color="red">
                {form.errors.lastName}
              </Text>
            )}
          </Flex>
        </Group>
        <Group>
          <Flex w="419px" direction="column">
            <InputLabel>Email Address</InputLabel>
            <TextInput
              placeholder="john@example.com"
              required
              className={`${styles.inputField} ${
                form.errors.email ? styles.errorBorder : ""
              }`}
              variant="unstyled"
              {...form.getInputProps("email")}
              error={null}
            />
            {form.errors.email && (
              <Text className={styles.errorText} size="xs" color="red">
                {form.errors.email}
              </Text>
            )}
          </Flex>
          <Flex w="419px" direction="column">
            <InputLabel>Contact</InputLabel>
            <PhoneInput
              defaultCountry="IN"
              {...form.getInputProps("phone")}
              onChange={(value) => form.setFieldValue("phone", value || "")}
              onBlur={() => form.validateField("phone")}
              placeholder="XXXXX XXXXX"
              className={`${styles.inputField} ${
                form.errors.phone ? styles.errorBorder : ""
              }`}
              error={null}
            />
            {form.errors.phone && (
              <Text className={styles.errorText} size="xs" color="red">
                {form.errors.phone}
              </Text>
            )}
          </Flex>
        </Group>
      </Stack>
    </Box>
  );
}
