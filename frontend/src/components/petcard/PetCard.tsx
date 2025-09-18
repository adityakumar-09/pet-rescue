import React, { useState } from 'react';
import { MapPin, Calendar, X, PawPrint, Heart, Droplet, Ruler, Sigma, Shield, Stethoscope } from 'lucide-react';
import type { Pet } from '../../services/api';

interface PetCardProps {
  pet: Pet;
}

// Helper to format date or return "Not Available"
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not Available';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Not Available';
  }
};

// Helper to format boolean fields
const formatBoolean = (value?: boolean) => {
    return value ? 'Yes' : 'No';
};


// ✅ Modal component with the new layout
const PetDetailModal: React.FC<{ pet: Pet; onClose: () => void }> = ({ pet, onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform scale-95 md:scale-100 transition-transform duration-300 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10">
            <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
            {/* --- Left Column: Image and Key Info --- */}
            <div className="md:w-1/3 p-6 flex flex-col items-center bg-gray-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <img
                    src={pet.image || 'https://via.placeholder.com/250?text=No+Image'}
                    alt={`Photo of ${pet.name}`}
                    className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg mb-4"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/250?text=No+Image'; }}
                />
                <h2 className="text-3xl font-bold text-gray-800 text-center">{pet.name || 'Not Available'}</h2>
                <span className="text-lg text-gray-600 italic mt-1">{pet.breed || 'Not Available'}</span>

                <div className="w-full border-t my-4"></div>

                {/* Info moved to the left column */}
                <div className="w-full space-y-3 text-left">
                    <p className="flex items-center text-gray-700"><PawPrint className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" /> <strong>Type:</strong> <span className="ml-auto">{pet.pet_type || 'Not Available'}</span></p>
                    <p className="flex items-center text-gray-700"><Heart className="w-4 h-4 mr-3 text-pink-500 flex-shrink-0" /> <strong>Gender:</strong> <span className="ml-auto">{pet.gender || 'Not Available'}</span></p>
                    <p className="flex items-center text-gray-700"><Sigma className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" /> <strong>Age:</strong> <span className="ml-auto">{pet.age || 'Not Available'}</span></p>
                    <p className="flex items-center text-gray-700"><Ruler className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" /> <strong>Weight:</strong> <span className="ml-auto">{pet.weight ? `${pet.weight} kg` : 'Not Available'}</span></p>
                    <p className="flex items-center text-gray-700"><Droplet className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" /> <strong>Color:</strong> <span className="ml-auto">{pet.color || 'Not Available'}</span></p>
                </div>

                <div className="w-full border-t my-4"></div>

                <div className="w-full text-left">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center"><MapPin className="w-5 h-5 mr-2 text-red-500" />Location</h4>
                    <p className="text-sm text-gray-700">{pet.address || 'Not Available'}</p>
                    <p className="text-sm text-gray-700">{`${pet.city || ''}, ${pet.state || ''} - ${pet.pincode || ''}`.replace(/^, |, $/g, '') || 'Not Available'}</p>
                </div>
            </div>

            {/* --- Right Column: Description and Medical Info --- */}
            <div className="md:w-2/3 p-8 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">About {pet.name}</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{pet.description || 'Not Available'}</p>
                </div>

                <div className="border-t pt-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Stethoscope className="w-6 h-6 mr-2 text-teal-500" />Medical Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <p className="text-gray-700"><strong>Diseased:</strong> <span className="font-medium text-gray-900">{formatBoolean(pet.is_diseased)}</span></p>
                        {pet.is_diseased && (
                            <>
                                <p className="text-gray-700"><strong>Disease:</strong> <span className="font-medium text-gray-900">{pet.disease_name || 'Not Available'}</span></p>
                                <p className="text-gray-700"><strong>Stage:</strong> <span className="font-medium text-gray-900">{pet.stage || 'Not Available'}</span></p>
                                <p className="text-gray-700"><strong>For:</strong> <span className="font-medium text-gray-900">{pet.no_of_years || 'Not Available'} years</span></p>
                            </>
                        )}
                         <p className="text-gray-700 col-span-full sm:col-span-1"><strong>Vaccinated:</strong> <span className="font-medium text-gray-900">{formatBoolean(pet.is_vaccinated)}</span></p>
                        {pet.is_vaccinated && (
                            <>
                                <p className="text-gray-700"><strong>Vaccine:</strong> <span className="font-medium text-gray-900">{pet.vaccination_name || 'Not Available'}</span></p>
                                <p className="text-gray-700"><strong>Last Date:</strong> <span className="font-medium text-gray-900">{formatDate(pet.last_vaccinated_date)}</span></p>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-auto border-t pt-6 flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Listed on: <strong>{formatDate(pet.created_date)}</strong></span>
                    </div>
                     <button
                        onClick={onClose}
                        className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


// Fallback SVG (no changes)
const AnimalSilhouettePlaceholder: React.FC = () => (
  <div className="w-full h-56 flex items-center justify-center bg-gray-200">
    <svg
      className="w-2/3 h-2/3 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="currentColor">
        <path d="M52.5,45.2c-2.2-0.3-4.4,0.3-6.1,1.5c-2.3,1.6-3.8,4.2-3.8,7.1v9.9c0,2.1,1.7,3.8,3.8,3.8h1c0.6,0,1-0.4,1-1v-2.8c0-3.3,2.7-6,6-6h2c3.3,0,6,2.7,6,6v2.8c0,0.6,0.4,1,1,1h1c2.1,0,3.8-1.7,3.8-3.8v-9.9c0-2.9-1.5-5.5-3.8-7.1C56.9,45.5,54.7,44.9,52.5,45.2z M88.8,35.3c-5.8-0.1-10.4,4.5-10.4,10.2v18.2c0,5.7,4.7,10.3,10.4,10.3s10.4-4.6,10.4-10.3V45.5C99.2,39.8,94.6,35.3,88.8,35.3z"/>
        <path d="M140.8,40.3c-2.1-1.3-4.7-1.4-7-0.3c-3.1,1.5-5.2,4.6-5.2,8.2v12.2c0,4.4,3.6,8,8,8h2c1.1,0,2-0.9,2-2v-4c0-2.2,1.8-4,4-4s4,1.8,4,4v4c0,1.1,0.9,2,2,2h2c4.4,0,8-3.6,8-8V48.2c0-3.5-2.1-6.7-5.2-8.2C145.5,38.9,142.9,39,140.8,40.3z M176.5,30.5c-4.4,0-8,3.6-8,8v24c0,4.4,3.6,8,8,8s8-3.6,8-8v-24C184.5,34.1,180.9,30.5,176.5,30.5z"/>
      </g>
    </svg>
  </div>
);

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageError = () => setImageError(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const truncateDescription = (text?: string) => {
    if (!text) return 'No description available';
    const lines = text.split('\n');
    if (lines.length > 2) {
      return lines.slice(0, 2).join('\n') + '...';
    }
    if (text.length > 100) {
      return text.substring(0, 100) + '...';
    }
    return text;
  };

  return (
    <>
      <div
        onClick={openModal}
        className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
      >
        {pet.image && !imageError ? (
          <img
            src={pet.image}
            alt={`Photo of ${pet.name}`}
            className="w-full h-56 object-cover"
            onError={handleImageError}
          />
        ) : (
          <AnimalSilhouettePlaceholder />
        )}

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span>{pet.breed ?? 'Unknown breed'}</span>
            <span className="mx-2">•</span>
            <span>{pet.age ?? 'Unknown age'}</span>
            <span className="mx-2">•</span>
            <span>{pet.gender ?? 'Unknown'}</span>
          </div>

          <p className="text-gray-700 mb-4 text-sm flex-grow whitespace-pre-line">
            {truncateDescription(pet.description)}
          </p>

          <div className="space-y-2 mb-4 text-sm text-gray-700 border-t pt-4 mt-auto">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
              <span>Location: <strong>{pet.address ?? 'N/A'}</strong></span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" />
              <span>Listed on: <strong>{new Date(pet.created_date).toLocaleDateString()}</strong></span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={openModal}
              className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md hover:shadow-lg"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <PetDetailModal pet={pet} onClose={closeModal} />}
    </>
  );
};

export default PetCard;