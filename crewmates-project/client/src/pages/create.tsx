import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertCrewmateSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useCrewmates } from "../hooks/useSupabase";
import crewmatesImage from "@/assets/crewmates-group.svg";

const colors = ["Red", "Green", "Blue", "Purple", "Yellow", "Orange", "Pink", "Rainbow"];

const createSchema = insertCrewmateSchema.extend({
  name: z.string().min(1, "Name is required"),
  speed: z.coerce.number().min(0, "Speed must be a positive number"),
  color: z.string().min(1, "Color is required")
});

type CreateFormValues = z.infer<typeof createSchema>;

export default function Create() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { createCrewmate } = useCrewmates();
  const createMutation = createCrewmate();
  
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
      speed: 0,
      color: selectedColor
    }
  });

  const onSubmit = async (data: CreateFormValues) => {
    try {
      // Update form values with current color selection
      const crewmateData = {
        ...data,
        color: selectedColor,
        created_at: new Date().toISOString()
      };

      // Use Supabase service to create crewmate
      const result = await createMutation.mutateAsync(crewmateData);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Navigate to gallery page
      navigate("/gallery");
    } catch (error: any) {
      console.error("Error creating crewmate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create crewmate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center">
      <h1 className="page-title">Create a New Crewmate</h1>
      
      <div className="flex justify-center mb-8">
        <img 
          src={crewmatesImage} 
          alt="Crewmates" 
          className="h-20 mx-auto"
        />
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
        <div className="form-container">
          <label htmlFor="name" className="block text-white text-lg font-medium mb-2">Name:</label>
          <input 
            type="text" 
            id="name"
            {...register("name")}
            className="w-full bg-zinc-700 text-white px-3 py-2 rounded-sm" 
            placeholder="Enter crewmate's name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        
        <div className="form-container">
          <label htmlFor="speed" className="block text-white text-lg font-medium mb-2">Speed (mph):</label>
          <input 
            type="number" 
            id="speed"
            {...register("speed")}
            className="w-full bg-zinc-700 text-white px-3 py-2 rounded-sm" 
            placeholder="Enter speed in mph"
            step="0.1"
            min="0"
          />
          {errors.speed && (
            <p className="mt-1 text-sm text-red-400">{errors.speed.message}</p>
          )}
        </div>
        
        <div className="form-container">
          <label className="block text-white text-lg font-medium mb-2">Color:</label>
          <div className="space-y-2">
            {colors.map(color => (
              <div key={color} className="flex items-center">
                <input
                  type="radio"
                  id={`color-${color}`}
                  name="color"
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="mr-2"
                />
                <label htmlFor={`color-${color}`} className="text-white">
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="btn-primary px-6 py-2 text-lg"
        >
          Create Crewmate
        </button>
      </div>
    </div>
  );
}
