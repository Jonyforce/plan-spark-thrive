
import React from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { format } from 'date-fns';
import { RoutineReflection } from '@/types/routine';

const reflectionFormSchema = z.object({
  productivityRating: z.coerce.number().min(1).max(5),
  moodRating: z.coerce.number().min(1).max(5),
  energyRating: z.coerce.number().min(1).max(5),
  achievements: z.string().optional(),
  blockers: z.string().optional(),
});

type ReflectionFormValues = z.infer<typeof reflectionFormSchema>;

interface ReflectionFormProps {
  date?: Date;
  existingReflection?: RoutineReflection;
  onSubmit: (values: ReflectionFormValues & { date: string }) => void;
  onCancel: () => void;
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({
  date = new Date(),
  existingReflection,
  onSubmit,
  onCancel
}) => {
  const form = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      productivityRating: existingReflection?.productivityRating || 3,
      moodRating: existingReflection?.moodRating || 3,
      energyRating: existingReflection?.energyRating || 3,
      achievements: existingReflection?.achievements || '',
      blockers: existingReflection?.blockers || '',
    },
  });

  const handleSubmit = (values: ReflectionFormValues) => {
    onSubmit({
      ...values,
      date: format(date, 'yyyy-MM-dd')
    });
  };

  const getLabelByValue = (value: number, type: string): string => {
    const labels = {
      productivity: {
        1: 'Unproductive',
        2: 'Somewhat Unproductive',
        3: 'Average',
        4: 'Productive',
        5: 'Very Productive'
      },
      mood: {
        1: 'Very Low',
        2: 'Low',
        3: 'Neutral',
        4: 'Good',
        5: 'Excellent'
      },
      energy: {
        1: 'Exhausted',
        2: 'Tired',
        3: 'Okay',
        4: 'Energetic',
        5: 'Very Energetic'
      }
    };
    
    return labels[type as keyof typeof labels][value as keyof typeof labels.productivity];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-lg font-medium">
          Reflection for {format(date, 'EEEE, MMMM d, yyyy')}
        </div>

        <FormField
          control={form.control}
          name="productivityRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Productivity: {getLabelByValue(field.value, 'productivity')}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Unproductive</span>
                <span>Very Productive</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moodRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mood: {getLabelByValue(field.value, 'mood')}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="energyRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Energy Level: {getLabelByValue(field.value, 'energy')}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Exhausted</span>
                <span>Very Energetic</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What went well today?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List your achievements or things that went well"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blockers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What blocked you today?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any challenges or blockers you faced"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Reflection</Button>
        </div>
      </form>
    </Form>
  );
};

export default ReflectionForm;
