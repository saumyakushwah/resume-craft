import {
  Box,
  Checkbox,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { storagePrefix } from "@/utils/storage";
import styles from "./index.module.scss";
import Image from "next/image";
import { base64ToFile } from "../ResumeUpload";
import { useMediaQuery } from "@mantine/hooks";

type SummaryProps = {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
};

const Summary = ({ agreed, setAgreed }: SummaryProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [, setProgress] = useState<number>(0);

  const isMobileOrTablet = useMediaQuery("(max-width: 900px)");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [skills, setSkills] = useState<{ name: string; level: string }[]>([]);
  const [education, setEducation] = useState<
    { degreeName: string; institution: string; yearOfCompletion: string }[]
  >([]);

  useEffect(() => {
    // Resume
    const savedFileName = localStorage.getItem(
      `${storagePrefix}uploadedFileName`
    );
    const savedFileType = localStorage.getItem(
      `${storagePrefix}uploadedFileType`
    );
    const savedProgress = localStorage.getItem(
      `${storagePrefix}uploadProgress`
    );
    const savedFile = localStorage.getItem(`${storagePrefix}uploadedFile`);

    console.log("savedFileName", savedFileName);

    if (savedFile && savedFileName && savedFileType) {
      const resumeFile = base64ToFile(savedFile, savedFileName, savedFileType);
      setFile(resumeFile);
    }
    if (savedProgress) setProgress(Number(savedProgress));

    // Basic Info
    setFirstName(localStorage.getItem(`${storagePrefix}firstName`) || "");
    setLastName(localStorage.getItem(`${storagePrefix}lastName`) || "");
    setEmail(localStorage.getItem(`${storagePrefix}email`) || "");
    setPhone(localStorage.getItem(`${storagePrefix}phone`) || "");

    // Skills
    const savedSkills = localStorage.getItem(`${storagePrefix}skills`);
    if (savedSkills) setSkills(JSON.parse(savedSkills));

    // Education
    const savedEdu = localStorage.getItem(`${storagePrefix}education`);
    if (savedEdu) setEducation(JSON.parse(savedEdu));
  }, []);

  const downloadResume = () => {
    if (!file) return;

    const fileName = file.name;

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box py="lg">
      <Stack gap="xl">
        <h3 className={styles.heading}>Summary</h3>

        {/* Resume */}
        <Stack gap="xs">
          <Title order={4} className={styles.subheading}>
            Resume
          </Title>
          <Text mt={isMobileOrTablet ? 10 : 40} mb={16} size="sm" c="dimmed">
            File name
          </Text>
          <Group>
            <Text fw={600} fz={16}>
              {file?.name || "resume.pdf"}
            </Text>
            <Image
              className={styles.downloadIcon}
              src="/images/download-icon.svg"
              alt="download"
              width={15}
              height={15}
              onClick={downloadResume}
            />
          </Group>
        </Stack>

        <Divider mt={isMobileOrTablet ? "10px" : "30px"} />

        {/* Basic Info */}
        <Stack>
          <Title order={4} className={styles.subheading}>
            Basic Information
          </Title>
          <Grid>
            <Grid.Col span={isMobileOrTablet ? 6 : 3}>
              <Text
                mt={isMobileOrTablet ? 10 : 40}
                mb={16}
                size="sm"
                c="dimmed"
              >
                First Name
              </Text>
              <Text fw={600} fz={16}>
                {firstName}
              </Text>
            </Grid.Col>
            <Grid.Col span={isMobileOrTablet ? 6 : 3}>
              <Text
                mt={isMobileOrTablet ? 10 : 40}
                mb={16}
                size="sm"
                c="dimmed"
              >
                Last Name
              </Text>
              <Text fw={600} fz={16}>
                {lastName}
              </Text>
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={isMobileOrTablet ? 6 : 3}>
              <Text
                mt={isMobileOrTablet ? 10 : 40}
                mb={16}
                size="sm"
                c="dimmed"
              >
                Email
              </Text>
              <Text fw={600} fz={16}>
                {email}
              </Text>
            </Grid.Col>
            <Grid.Col span={isMobileOrTablet ? 6 : 3}>
              <Text
                mt={isMobileOrTablet ? 10 : 40}
                mb={16}
                size="sm"
                c="dimmed"
              >
                Phone
              </Text>
              <Text fw={600} fz={16}>
                {phone}
              </Text>
            </Grid.Col>
          </Grid>
        </Stack>

        <Divider mt="30px" />

        {/* Skills */}
        <Stack gap="xs">
          <Title order={4} className={styles.subheading}>
            Skill Sets
          </Title>
          {skills.map((skill, i) => (
            <Grid key={i}>
              <Grid.Col span={isMobileOrTablet ? 6 : 3}>
                <Text
                  fw={500}
                  size="sm"
                  mt={isMobileOrTablet ? 10 : 40}
                  mb={16}
                  c="dimmed"
                >
                  {`Skill ${i + 1}`}
                </Text>
                <Text fw={600} fz={16}>
                  {skill.name}
                </Text>
              </Grid.Col>
              <Grid.Col span={isMobileOrTablet ? 6 : 3}>
                <Text
                  fw={500}
                  size="sm"
                  mt={isMobileOrTablet ? 10 : 40}
                  mb={16}
                  c="dimmed"
                >
                  Experience Level
                </Text>
                <Text fw={600} fz={16}>
                  {skill.level}
                </Text>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>

        <Divider mt="30px" />

        {/* Education */}
        <Stack gap="xs">
          <Title order={4} className={styles.subheading}>
            Education
          </Title>
          {education.map((edu, i) => (
            <Grid key={i}>
              <Grid.Col span={isMobileOrTablet ? 4 : 3}>
                {" "}
                <Text
                  fw={500}
                  size="sm"
                  mt={isMobileOrTablet ? 10 : 40}
                  mb={16}
                  c="dimmed"
                >
                  Degree Name
                </Text>
                <Text fw={600} fz={16}>
                  {edu.degreeName}
                </Text>
              </Grid.Col>
              <Grid.Col span={isMobileOrTablet ? 4 : 3}>
                <Text
                  fw={500}
                  size="sm"
                  mt={isMobileOrTablet ? 10 : 40}
                  mb={16}
                  c="dimmed"
                >
                  University
                </Text>
                <Text fw={600} fz={16}>
                  {edu.institution}
                </Text>
              </Grid.Col>
              <Grid.Col span={isMobileOrTablet ? 4 : 3}>
                {" "}
                <Text
                  fw={500}
                  size="sm"
                  mt={isMobileOrTablet ? 10 : 40}
                  mb={16}
                  c="dimmed"
                >
                  Year of Completion
                </Text>
                <Text fw={600} fz={16}>
                  {edu.yearOfCompletion}
                </Text>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>

        <Divider mt="30px" />

        {/* Terms */}
        <Stack gap="xs">
          <Text fw={500} fz={16} size="sm" c="dimmed">
            By submitting this form, you confirm that all information provided
            is accurate and complete to the best of your knowledge. Any false or
            misleading information may result in disqualification from the
            recruitment process or termination of employment if discovered
            later.
            <br />
            <br />
            Submission of this form does not guarantee an interview or
            employment. Your personal data will be handled confidentially and
            used solely for recruitment purposes in accordance with Beyonds Labs
            LLC Privacy Policy.
          </Text>
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.currentTarget.checked)}
            label="By submitting, you agree to our Terms & Conditions."
            fw={600}
            fz={16}
            color="#F66135"
            mt={24}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Summary;
