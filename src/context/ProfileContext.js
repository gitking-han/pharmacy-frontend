import React, { createContext, useState, useEffect } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("token"),
  });

  // Fetch the logged-in user's profile
  const fetchProfile = async () => { 
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/profile/me", {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Create or Update profile
  const saveProfile = async (data) => {
    try {
      setError(null);
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error saving profile:", err.message);
      setError("Unable to save profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, fetchProfile, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
