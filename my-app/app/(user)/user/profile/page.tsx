'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserHeaderWrapper from '@/app/(user)/user/UserHeaderWrapper/page';
import ProfileForm from '@/app/components/profile/ProfileForm';
import ProfileInfo from '@/app/components/profile/ProfileInfo';
import styles from '@/app/components/profile/Profile.module.css';

interface UserProfile {
     _id: string;
     name: string;
     email: string;
     address?: string;
     phone?: string;
}

export default function ProfilePage() {
     const router = useRouter();
     const [profile, setProfile] = useState<UserProfile | null>(null);
     const [isEditing, setIsEditing] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [success, setSuccess] = useState<string | null>(null);

     useEffect(() => {
          fetchProfile();
     }, []);

     const fetchProfile = async () => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.replace('/login');
                    return;
               }

               const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });

               if (!response.ok) {
                    throw new Error('Failed to fetch profile');
               }

               const data = await response.json();
               setProfile(data);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to fetch profile');
          }
     };

     const handleSubmit = async (formData: Partial<UserProfile>) => {
          try {
               const token = localStorage.getItem('token');
               if (!token) {
                    router.replace('/login');
                    return;
               }

               const response = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'PUT',
                    headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
               });

               if (!response.ok) {
                    throw new Error('Failed to update profile');
               }

               const updatedProfile = await response.json();
               setProfile(updatedProfile);
               setIsEditing(false);
               setSuccess('Profile updated successfully');
               setTimeout(() => setSuccess(null), 3000);
          } catch (err) {
               setError(err instanceof Error ? err.message : 'Failed to update profile');
          }
     };

     if (!profile) {
          return <div className={styles.loading}>Loading...</div>;
     }

     return (
          <>
               <UserHeaderWrapper />
               <div className={styles.container}>
                    <h1 className={styles.title}>Profile</h1>

                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}

                    {isEditing ? (
                         <ProfileForm
                              profile={profile}
                              onSubmit={handleSubmit}
                              onCancel={() => {
                                   setIsEditing(false);
                              }}
                         />
                    ) : (
                         <ProfileInfo
                              profile={profile}
                              onEdit={() => setIsEditing(true)}
                         />
                    )}
               </div>
          </>
     );
} 