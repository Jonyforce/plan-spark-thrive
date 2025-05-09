
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RoutineTask, RoutineTaskType } from "@/types/routine";
import { timeToMinutes, formatDayOfWeek } from "@/utils/timeUtils";

const taskFormSchema = z.object({
  name: z.string().min(1, {
    message: "Task name is required",
  }),
  description: z.string().optional(),
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string(),
  duration: z.coerce.number().min(5).max(480),
  taskType: z.enum(['regular', 'break', 'custom', 'disruption', 'pending']),
  isRecurring: z.boolean().default(false),
  color: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: RoutineTask;
  templateId: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  templateId,
  onSubmit,
  onCancel
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      dayOfWeek: task?.dayOfWeek || 0,
      startTime: task ? `${Math.floor(task.startTime / 60).toString().padStart(2, '0')}:${(task.startTime % 60).toString().padStart(2, '0')}` : "09:00",
      duration: task?.duration || 30,
      taskType: task?.taskType || "regular",
      isRecurring: task?.isRecurring || false,
      color: task?.color || "blue",
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    // Convert time string to minutes from midnight
    const startTimeMinutes = timeToMinutes(values.startTime);
    
    onSubmit({
      ...values,
      startTime: startTimeMinutes,
      templateId
    });
  };
  
  const colorOptions = [
    { value: "slate", label: "Slate" },
    { value: "gray", label: "Gray" },
    { value: "zinc", label: "Zinc" },
    { value: "neutral", label: "Neutral" },
    { value: "stone", label: "Stone" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "amber", label: "Amber" },
    { value: "yellow", label: "Yellow" },
    { value: "lime", label: "Lime" },
    { value: "green", label: "Green" },
    { value: "emerald", label: "Emerald" },
    { value: "teal", label: "Teal" },
    { value: "cyan", label: "Cyan" },
    { value: "sky", label: "Sky" },
    { value: "blue", label: "Blue" },
    { value: "indigo", label: "Indigo" },
    { value: "violet", label: "Violet" },
    { value: "purple", label: "Purple" },
    { value: "fuchsia", label: "Fuchsia" },
    { value: "pink", label: "Pink" },
    { value: "rose", label: "Rose" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormDescription>
                Add additional details about this task
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day of Week</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {formatDayOfWeek(day)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration: {field.value} minutes</FormLabel>
              <FormControl>
                <Slider
                  min={5}
                  max={480}
                  step={5}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>
                Set task duration in minutes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="taskType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="disruption">Disruption</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className={`w-4 h-4 mr-2 rounded-full bg-${color.value}-500`}
                            style={{ backgroundColor: `var(--${color.value}-500)` }}
                          ></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Recurring Task</FormLabel>
                <FormDescription>
                  This task will repeat weekly
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
