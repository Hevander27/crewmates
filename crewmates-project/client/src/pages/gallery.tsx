import { Link } from "wouter";
import crewmateSilhouette from "@/assets/crewmate-silhouette.svg";
import { useCrewmates } from "../hooks/useSupabase";
import { Tables } from "../types/database.types";

export default function Gallery() {
  const { getCrewmates } = useCrewmates();
  const { data: crewmates, isLoading, error } = getCrewmates();

  // Function to get the appropriate color border class based on crewmate's color
  const getColorBorderClass = (coor: string) => {
    // Ensure color is not undefined or null before converting to lowercase
    const colorStr = color || "";
    const colorLower = colorStr.toLowerCase();
    
    // Map the color string to our CSS class names
    switch (colorLower) {
      case "red": return "color-border-red";
      case "green": return "color-border-green";
      case "blue": return "color-border-blue";
      case "purple": return "color-border-purple";
      case "yellow": return "color-border-yellow";
      case "orange": return "color-border-orange";
      case "pink": return "color-border-pink";
      case "rainbow": return "color-border-rainbow";
      default: return "color-border-blue"; // Default fallback
    }
  };

  return (
    <div className="text-center">
      <h1 className="page-title">Your Crewmate Gallery!</h1>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <p className="text-gray-300">Loading crewmates...</p>
        </div>
      ) : error ? (
        <div className="bg-zinc-800 p-4 rounded-md max-w-md mx-auto">
          <h3 className="text-red-400 font-medium">Error loading crewmates</h3>
          <p className="text-gray-300 mt-1">Please try refreshing the page.</p>
        </div>
      ) : crewmates && crewmates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8">
          {crewmates.map(crewmate => (
            <div 
              key={crewmate.id} 
              className={`crewmate-card ${getColorBorderClass(crewmate.color)}`}
            >
              <img 
                src={crewmateSilhouette} 
                alt="Crewmate" 
                className="w-24 h-24 mb-4"
              />
              
              <div className="text-white text-center">
                <p className="mb-2"><span className="font-medium">Name of Crewmate:</span> {crewmate.name}</p>
                <p className="mb-2"><span className="font-medium">Speed of Crewmate:</span> {crewmate.speed} mph</p>
                <p className="mb-4"><span className="font-medium">Color of Crewmate:</span> {crewmate.color}</p>
              </div>
              
              <Link href={`/edit/${crewmate.id}`}>
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-md transition-colors">
                  Edit Crewmate
                </button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center my-12">
          <p className="text-gray-300 mb-6">You haven't made a crewmate yet!</p>
          <Link href="/create">
            <button className="btn-primary px-6 py-2">
              Create one here!
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
