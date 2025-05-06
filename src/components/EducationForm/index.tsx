import { useState, useEffect, CSSProperties } from "react";
import {
  Box,
  TextInput,
  Button,
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

export interface Education {
  id: string;
  degreeName: string;
  institution: string;
  yearOfCompletion: string;
}

interface SortableEducationItemProps {
  id: string;
  education: Education;
  onRemove: (index: number) => void;
  index: number;
}

interface EducationFormProps {
  onSave?: (education: Education[]) => void;
  initialEducation?: Education[];
}

const SortableEducationItem = ({
  id,
  education,
  onRemove,
  index,
}: SortableEducationItemProps) => {
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
  } as CSSProperties;

  return (
    <Box ref={setNodeRef} style={style}>
      <Box mr="8px" {...attributes} {...listeners}>
        <IconGripVertical size={12} color="#F66135" />
      </Box>
      <Text mr="10px" color="#5C5C5C" size="md" tt="capitalize">
        {education.institution}
      </Text>
      <Text mr="10px" size="md" color="#5C5C5C">
        ({education.yearOfCompletion})
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

const EducationForm = ({
  onSave,
  initialEducation = [],
}: EducationFormProps) => {
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");
  const [hasMounted, setHasMounted] = useState(false);

  interface FormValues {
    degreeName: string;
    institution: string;
    yearOfCompletion: string;
  }

  useEffect(() => {
    const storedEducation = localStorage.getItem(`${storagePrefix}education`);
    if (storedEducation) {
      setEducation(JSON.parse(storedEducation));
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(
        `${storagePrefix}education`,
        JSON.stringify(education)
      );
      if (onSave) {
        onSave(education);
      }
    }
  }, [education, onSave, hasMounted]);

  const form = useForm<FormValues>({
    initialValues: {
      degreeName: "",
      institution: "",
      yearOfCompletion: "",
    },
    validate: {
      degreeName: (value: string) =>
        value.length < 2 ? "Degree name must be at least 2 characters" : null,
      institution: (value: string) =>
        value.length < 2
          ? "Institution name must be at least 2 characters"
          : null,
      yearOfCompletion: (value: string) => {
        if (!value) return "Year of completion is required";
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear + 10) {
          return (
            "Please enter a valid year between 1900 and " + (currentYear + 10)
          );
        }
        return null;
      },
    },
  });

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

    if (over && active.id !== over.id) {
      setEducation((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Add a new education entry
  const handleAddEducation = (values: FormValues) => {
    const newEducation: Education = {
      id: `education-${Date.now()}`,
      degreeName: values.degreeName,
      institution: values.institution,
      yearOfCompletion: values.yearOfCompletion,
    };

    setEducation([...education, newEducation]);
    form.reset();
    setIsFormVisible(false);
    setValidationError("");
  };

  // Remove an education entry
  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };

  // Effect to pass education data to parent component when education changes
  useEffect(() => {
    if (onSave) {
      onSave(education);
    }
  }, [education, onSave]);

  return (
    <Box>
      <h3 className={styles.heading}>Add Education Details</h3>

      {validationError && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {validationError}
        </Alert>
      )}

      {education.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={education.map((edu) => edu.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {education.map((edu, index) => (
                <SortableEducationItem
                  key={edu.id}
                  id={edu.id}
                  education={edu}
                  index={index}
                  onRemove={handleRemoveEducation}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isFormVisible ? (
        <Paper mt="16px" mb="md">
          <form onSubmit={form.onSubmit(handleAddEducation)}>
            <Stack gap={20}>
              <Group>
                <Flex w="419px" direction="column">
                  <InputLabel>Degree Name</InputLabel>
                  <TextInput
                    placeholder="Enter degree name"
                    required
                    mb="sm"
                    className={styles.inputField}
                    variant="unstyled"
                    {...form.getInputProps("degreeName")}
                  />
                </Flex>
                <Flex w="419px" direction="column">
                  <InputLabel>University/College</InputLabel>
                  <TextInput
                    placeholder="Enter institution name"
                    required
                    mb="sm"
                    className={styles.inputField}
                    variant="unstyled"
                    {...form.getInputProps("institution")}
                  />
                </Flex>
              </Group>
              <Group>
                <Flex w="419px" direction="column">
                  <InputLabel>Year of Completion</InputLabel>
                  <TextInput
                    placeholder="YYYY"
                    required
                    mb="sm"
                    className={styles.inputField}
                    variant="unstyled"
                    {...form.getInputProps("yearOfCompletion")}
                    rightSection={
                      <Image
                        src="/images/calendar-icon.svg"
                        alt="calendar"
                        width={25}
                        height={26}
                      />
                    }
                  />
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

export default EducationForm;
