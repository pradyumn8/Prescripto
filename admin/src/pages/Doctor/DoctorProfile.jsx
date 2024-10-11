import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';  // Import Axios if not already done
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false); // Changed to `isEdit` for consistency

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dToken },
      });
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false); // Close edit mode after update
        getProfileData();  // Refresh profile data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div>
          <img
            className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
            src={profileData.image}
            alt={`${profileData.name}'s profile`}
          />
        </div>
        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          {/* Doctor info: name, degree, experience */}
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <p className="py-0.5 px-2 border text-xs rounded-full">
              {profileData.experience} years of experience
            </p>
          </div>
          {/* Doctor About Section */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About:
            </p>
            <p>{profileData.about}</p>
          </div>
          {/* Appointment fee */}
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>
          {/* Address */}
          <div className="flex gap-2 py-2">
            <p>Address:</p>
            <p className="text-sm">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                  <br />
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                </>
              ) : (
                <>
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </>
              )}
            </p>
          </div>
          {/* Availability Checkbox */}
          <div className="flex gap-1 pt-2">
            <input
              type="checkbox"
              checked={profileData.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              readOnly={!isEdit}
            />
            <label>Available</label>
          </div>
          {/* Edit Button */}
          <button
            onClick={() => {
              if (isEdit) {
                updateProfile(); // Save updates
              } else {
                setIsEdit(true); // Enter edit mode
              }
            }}
            className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
          >
            {isEdit ? "Save" : "Edit"}
          </button>
          {/* Cancel Edit Button */}
          {isEdit && (
            <button
              onClick={() => setIsEdit(false)}
              className="px-4 py-1 ml-4 border border-red-500 text-sm rounded-full mt-5 hover:bg-red-500 hover:text-white transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
