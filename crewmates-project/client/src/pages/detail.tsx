import { Link, useParams, useLocation } from "wouter";
import { AlertTriangle } from "lucide-react";
import crewmatesImage from "@/assets/crewmates-group.svg";
import { useCrewmates } from "../hooks/useSupabase";
import { Tables } from "../types/database.types";

export default function Detail() {
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : 0;
  const [, navigate] = useLocation();
  
  const { getCrewmate, deleteCrewmate } = useCrewmates();
  const deleteMutation = deleteCrewmate();
  const { data: crewmate, isLoading, error } = getCrewmate(numericId);

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
          <p className="text-gray-300 mb-6">The crewmate you're looking for doesn't exist or has been deleted.</p>
          <Link href="/gallery">
            <button className="btn-primary px-4 py-2">
              Back to Gallery
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Function to get the appropriate color for displaying
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      'red': 'text-red-500',
      'green': 'text-green-500',
      'blue': 'text-blue-500',
      'purple': 'text-purple-500',
      'yellow': 'text-yellow-500',
      'orange': 'text-orange-500',
      'pink': 'text-pink-500',
      'rainbow': 'text-purple-400'
    };
    
    return colorMap[color.toLowerCase()] || 'text-white';
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this crewmate? This action cannot be undone.")) {
      try {
        const result = await deleteMutation.mutateAsync(numericId);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        navigate('/gallery');
      } catch (error: any) {
        console.error("Error deleting crewmate:", error);
        alert(error.message || "Failed to delete crewmate. Please try again.");
      }
    }
  };

  return (
    <div className="text-center">
      <h1 className="page-title">Crewmate: {crewmate.name}</h1>
      
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Stats:</h2>
        
        <p className="mb-2 text-lg">
          Color: <span className={getColorClass(crewmate.color)}>{crewmate.color}</span>
        </p>
        
        <p className="mb-6 text-lg">
          Speed: {crewmate.speed} mph
        </p>
        
        {crewmate.speed < 3 && (
          <p className="text-yellow-300 mb-8">
            You may want to find a Crewmate with more speed, this one is kind of slow 😊
          </p>
        )}
        
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="btn-primary px-4 py-2"
          >
            Edit Crewmate
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Delete Crewmate
          </button>
        </div>
        
        <div className="flex justify-center">
          <img 
            src={crewmatesImage} 
            alt="Crewmates" 
            className="h-20"
          />
        </div>
      </div>
    </div>
  );
}
