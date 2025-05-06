import { useState, useEffect, CSSProperties } from "react";
import {
  Box,
  TextInput,
  Button,
  Select,
  Group,
  Paper,
  Text,
  ActionIcon,
  Alert,
  InputLabel,
  Flex,
  Stack,
} from "@mantine/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconGripVertical,
  IconAlertCircle,
  IconPlus,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import styles from "./index.module.scss";
import Image from "next/image";
import { storagePrefix } from "@/utils/storage";

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface SortableSkillItemProps {
  id: string;
  skill: Skill;
  onRemove: (index: number) => void;
  index: number;
}

interface SkillsFormProps {
  onSave?: (skills: Skill[]) => void;
  initialSkills?: Skill[];
}

const SortableSkillItem = ({
  id,
  skill,
  onRemove,
  index,
}: SortableSkillItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    display: "flex",
    alignItems: "center",
    padding: "14px 16px",
    border: "1px solid #ECECEC",
    borderRadius: "4px",
    backgroundColor: "#fff",
    width: "max-content",
    cursor: "grab",
    gap: "10px",
    textTransform: "capitalize",
  } as CSSProperties;

  return (
    <Box ref={setNodeRef} style={style}>
      <Box mr="8px" {...attributes} {...listeners}>
        <IconGripVertical size={12} color="#F66135" />
      </Box>
      <Text mr="10px" color="#5C5C5C" size="md">
        {skill.name}
      </Text>
      <Text mr="10px" size="md" color="#5C5C5C">
        ({skill.level})
      </Text>
      <ActionIcon
        size="xs"
        variant="transparent"
        color="gray"
        onClick={() => onRemove(index)}
      >
        <Image
          width={20}
          height={20}
          src="/images/cross-dark-icon.svg"
          alt="Cross Icon"
          className={styles.crossIcon}
        />
      </ActionIcon>
    </Box>
  );
};


const SkillsForm = ({ onSave, initialSkills = [] }: SkillsFormProps) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  interface FormValues {
    skillName: string;
    experienceLevel: string;
  }

  const form = useForm<FormValues>({
    initialValues: {
      skillName: "",
      experienceLevel: "",
    },
    validate: {
      skillName: (value: string) =>
        value.length < 2 ? "Skill name must be at least 2 characters" : null,
      experienceLevel: (value: string) =>
        !value ? "Please select an experience level" : null,
    },
  });

  useEffect(() => {
    const savedSkills = localStorage.getItem(`${storagePrefix}skills`);
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  useEffect(() => {
    if (skills.length > 0) {
      localStorage.setItem(`${storagePrefix}skills`, JSON.stringify(skills));
    }
  }, [skills]);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && over) {
      setSkills((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Add a new skill
  const handleAddSkill = (values: FormValues) => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: values.skillName,
      level: values.experienceLevel,
    };

    setSkills([...skills, newSkill]);
    form.reset();
    setIsFormVisible(false);
    setValidationError("");
  };

  // Remove a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  // Effect to pass skills data to parent component when skills change
  useEffect(() => {
    if (onSave) {
      onSave(skills);
    }
  }, [skills, onSave]);

  return (
    <Box>
      <h3 className={styles.heading}>Add Skill Sets</h3>

      {validationError && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {validationError}
        </Alert>
      )}

      {skills.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={skills.map((skill) => skill.id)}
            strategy={verticalListSortingStrategy}
          >
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {skills.map((skill, index) => (
                <SortableSkillItem
                  key={skill.id}
                  id={skill.id}
                  skill={skill}
                  index={index}
                  onRemove={handleRemoveSkill}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isFormVisible ? (
        <Paper mt="16px" mb="md">
          <form onSubmit={form.onSubmit(handleAddSkill)}>
            <Stack gap={20}>
              <Group>
                <Flex w="419px" direction="column">
                  <InputLabel>Add Skill</InputLabel>
                  <TextInput
                    placeholder="Enter skill name"
                    required
                    mb="xs"
                    className={`${styles.inputField} ${form.errors.skillName ? styles.errorBorder : ''}`}
                    variant="unstyled"
                    {...form.getInputProps("skillName")}
                    error={null}
                  />
                  {form.errors.skillName && (
                    <Text className={styles.errorText} size="xs" color="red">
                      {form.errors.skillName}
                    </Text>
                  )}
                </Flex>
                <Flex w="419px" direction="column">
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    placeholder="Select experience level"
                    data={[
                      { value: "Beginner", label: "Beginner" },
                      { value: "Intermediate", label: "Intermediate" },
                      { value: "Expert", label: "Expert" },
                    ]}
                    required
                    mb="xs"
                    {...form.getInputProps("experienceLevel")}
                    className={`${styles.inputField} ${form.errors.experienceLevel ? styles.errorBorder : ''}`}
                    variant="unstyled"
                    error={null}
                  />
                  {form.errors.experienceLevel && (
                    <Text className={styles.errorText} size="xs" color="red">
                      {form.errors.experienceLevel}
                    </Text>
                  )}
                </Flex>
              </Group>
            </Stack>

            <Group>
              <Button type="submit" className={styles.addButton}>
                Add <IconPlus size={18} style={{ marginLeft: "10px" }} />
              </Button>
            </Group>
          </form>
        </Paper>
      ) : (
        <Button
          type="submit"
          className={styles.addButton}
          onClick={() => setIsFormVisible(true)}
        >
          Add <IconPlus size={18} style={{ marginLeft: "10px" }} />
        </Button>
      )}

    </Box>
  );
};

export default SkillsForm;
