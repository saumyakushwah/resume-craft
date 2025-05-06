import { Box, Button, Group, Stack, Stepper, Text, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconCircleDot } from "@tabler/icons-react";
import ResumeUpload from "@/components/ResumeUpload";
import styles from "./index.module.scss";
import BasicInfoForm from "@/components/BasicInformation";
import AddSkills from "@/components/AddSkills";
import EducationForm, { Education } from "@/components/EducationForm";
import Summary from "@/components/Summary";
import { useBasicInfoForm } from "@/utils/useBasicInfoForm";
import { Skill } from "@/components/SkillSetStep";

export default function CustomStepper() {
  const form = useBasicInfoForm();

  const [active, setActive] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  const steps = [
    {
      label: "Upload Resume",
      description: "Upload your resume to get started",
      content: (
        <ResumeUpload
          file={file}
          setFile={setFile}
          progress={progress}
          setProgress={setProgress}
        />
      ),
    },
    {
      label: "Basic Information",
      description: "Provide your basic information",
      content: <BasicInfoForm form={form} />,
    },
    {
      label: "Skill Set",
      description: "Select your skill set",
      content: <AddSkills onSave={setUserSkills} />,
    },
    {
      label: "Education",
      description: "Provide your education details",
      content: <EducationForm onSave={setEducation} />,
    },
    {
      label: "Summary",
      description: "Provide a summary of your profile",
      content: <Summary agreed={agreed} setAgreed={setAgreed} />,
    },
    {
      label: "Completed",
      description: "Your profile is ready",
      content: (
        <Stack align="center" gap="16" mt="lg">
          <Title order={3} ta="center" className={styles.heading}>
            <span style={{ color: "#f66135" }}>Great!</span> Thank You for
            Applying
          </Title>
          <Text ta="center" c="dimmed" maw={500} className={styles.subheading}>
            We appreciate your application. Our team will review it, and we’ll
            reach out soon if there’s a match. Stay tuned!
          </Text>
          <Button variant="filled" className={styles.trackButton}>
            TRACK APPLICATION
          </Button>
        </Stack>
      ),
    },
  ];

  const validateStep = useCallback(
    (stepIndex: number) => {
      const validations = [
        { condition: !file, message: "Please upload your resume to proceed." },
        {
          condition: form.validate().hasErrors,
          message: "Please correct the highlighted fields to proceed.",
        },
        {
          condition: userSkills.length === 0,
          message: "Please select at least one skill to proceed.",
        },
        {
          condition: education.length === 0,
          message: "Please provide at least one education entry to proceed.",
        },
        {
          condition: !agreed,
          message: "Please agree to the terms before proceeding.",
        },
      ];

      const validation = validations[stepIndex];
      return validation?.condition ? validation.message : null;
    },
    [file, form, userSkills, education, agreed]
  );

  const nextStep = () => {
    const errorMessage = validateStep(active);
    if (errorMessage) {
      showNotification({
        title: "Incomplete Step",
        message: errorMessage,
        color: "red",
      });
      return;
    }
    setActive((prev) => prev + 1);
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  // const isCompleted = active === steps.length;

  const handleStepClick = (index: number) => {
    const errorMessage = validateStep(index - 1);
    if (errorMessage) {
      showNotification({
        title: "Incomplete Step",
        message: "Please complete the previous step to jump ahead.",
        color: "red",
      });
      return;
    }
    setActive(index);
  };

  console.log({ active, steps });
  return (
    <Box className={styles.stepperWrapper}>
      <Box className={styles.stepperContent}>
        <Stepper
          active={active}
          onStepClick={handleStepClick}
          classNames={{
            separator: styles.separator,
          }}
        >
          {steps.map((step, index) => {
            const isLastStep = index === steps.length - 1;
            const isStepActive = index === active;
            const isStepCompleted =
              index < active || (isLastStep && isStepActive);

            return (
              <Stepper.Step
                key={index}
                label={step.label}
                icon={
                  isStepCompleted ? (
                    <IconCircleCheck color="orange" size={16} />
                  ) : (
                    <IconCircleDot
                      color={isStepActive ? "orange" : "gray"}
                      size={16}
                    />
                  )
                }
                color={isStepCompleted || isStepActive ? "orange" : "white"}
                // completedIcon={<IconCircleDotFilled size={16} />}
              >
                <Box mt="62px">{step.content}</Box>
              </Stepper.Step>
            );
          })}
        </Stepper>
      </Box>

      <Group
        justify={active === steps.length - 2 ? "start" : "end"}
        className={styles.buttonGroup}
      >
        {active > 0 && active < steps.length - 1 && (
          <Button
            variant="default"
            onClick={prevStep}
            className={styles.backButton}
          >
            Back
          </Button>
        )}
        {active !== steps.length - 1 && (
          <Button
            onClick={nextStep}
            className={styles.nextButton}
            disabled={active >= steps.length}
          >
            {active === steps.length - 2 ? "Confirm" : "Next"}
          </Button>
        )}
      </Group>
    </Box>
  );
}
