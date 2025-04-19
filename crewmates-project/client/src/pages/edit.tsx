import { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateCrewmateSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import crewmatesImage from "@/assets/crewmates-group.svg";
import { useCrewmates } from "../hooks/useSupabase";

const colors = ["Red", "Green", "Blue", "Purple", "Yellow", "Orange", "Pink", "Rainbow"];

const editSchema = updateCrewmateSchema.extend({
  name: z.string().min(1, "Name is required"),
  speed: z.coerce.number().min(0, "Speed must be a positive number"),
  color: z.string().min(1, "Color is required")
});

type EditFormValues = z.infer<typeof editSchema>;

export default function Edit() {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : 0;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { getCrewmate, updateCrewmate, deleteCrewmate } = useCrewmates();
  const updateMutation = updateCrewmate();
  const deleteMutation = deleteCrewmate();
  
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const { data: crewmate, isLoading, error } = getCrewmate(numericId);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      speed: 0,
      color: ""
    }
  });

  useEffect(() => {
    if (crewmate) {
      // Set form values from fetched crewmate data
      reset({
        name: crewmate.name,
        speed: crewmate.speed,
        color: crewmate.color
      });
      
      // Set state for color selection
      setSelectedColor(crewmate.color);
    }
  }, [crewmate, reset]);

  const onSubmit = async (data: EditFormValues) => {
    try {
      // Update form values with current color selection
      const crewmateData = {
        ...data,
        color: selectedColor
      };

      // Use Supabase service to update crewmate
      const result = await updateMutation.mutateAsync({ 
        id: numericId, 
        updates: crewmateData 
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Navigate to detail page
      navigate(`/crewmate/${id}`);
    } catch (error: any) {
      console.error("Error updating crewmate:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update crewmate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this crewmate? This action cannot be undone.")) {
      try {
        const result = await deleteMutation.mutateAsync(numericId);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        // Navigate to gallery page
        navigate("/gallery");
      } catch (error: any) {
        console.error("Error deleting crewmate:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete crewmate. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <h1 className="page-title">Loading Crewmate...</h1>
        <div className="flex justify-center py-10">
          <p className="text-gray-300">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !crewmate) {
    return (
      <div className="text-center">
        <h1 className="page-title">Crewmate Not Found</h1>
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-gray-300 mb-6">The crewmate you're trying to edit doesn't exist or has been deleted.</p>
          <Link href="/gallery">
            <button className="btn-primary px-4 py-2">
              Back to Gallery
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="page-title">Update Your Crewmate :)</h1>
      
      <div className="flex justify-center mb-6">
        <img 
          src={crewmatesImage} 
          alt="Crewmates" 
          className="h-20 mx-auto"
        />
      </div>
      
      <div className="text-white mb-4">
        <h2 className="text-xl mb-2">Current Crewmate Info:</h2>
        <p>Name: {crewmate.name}, Speed: {crewmate.speed}, Color: {crewmate.color}</p>
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
      
      <div className="mt-10 flex justify-center gap-4">
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="btn-primary px-6 py-2 text-lg"
        >
          Update Crewmate
        </button>
        
        <button 
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-lg rounded-md transition-colors"
        >
          Delete Crewmate
        </button>
      </div>
    </div>
  );
}
