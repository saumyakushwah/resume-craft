import { Box, Paper, Title } from "@mantine/core";
import SkillsForm from "../AddSkills";
import { Dispatch, SetStateAction } from "react";

export interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SkillSetStepProps {
  userSkills: Skill[];
  setUserSkills: Dispatch<SetStateAction<Skill[]>>;
}

export default function SkillSetStep({
  // userSkills,
  setUserSkills,
}: SkillSetStepProps) {
  const handleSkillsChange = (skills: Skill[]) => {
    setUserSkills(skills);
    console.log("Updated skills:", skills);
  };

  return (
    <Box>
      <Title order={3} mb="md">
        Skill Set
      </Title>
      <Paper p="md">
        <SkillsForm
          onSave={handleSkillsChange}
          initialSkills={
            [
              // Optional: Provide initial skills
              // { id: 'skill-1', name: 'React', level: 'Expert' },
              // { id: 'skill-2', name: 'JavaScript', level: 'Expert' },
            ]
          }
        />
      </Paper>
    </Box>
  );
}
