import { useState } from 'react';
import styles from './Profile.module.css';

interface UserProfile {
     _id: string;
     name: string;
     email: string;
     address?: string;
     phone?: string;
}

interface ProfileFormProps {
     profile: UserProfile;
     onSubmit: (formData: Partial<UserProfile>) => Promise<void>;
     onCancel: () => void;
}

export default function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
     const [formData, setFormData] = useState<Partial<UserProfile>>(profile);

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setFormData(prev => ({
               ...prev,
               [name]: value
          }));
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          await onSubmit(formData);
     };

     return (
          <form onSubmit={handleSubmit} className={styles.form}>
               <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name || ''}
                         onChange={handleInputChange}
                         required
                    />
               </div>

               <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email || ''}
                         onChange={handleInputChange}
                         required
                    />
               </div>

               <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input
                         type="text"
                         id="address"
                         name="address"
                         value={formData.address || ''}
                         onChange={handleInputChange}
                    />
               </div>

               <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                         type="tel"
                         id="phone"
                         name="phone"
                         value={formData.phone || ''}
                         onChange={handleInputChange}
                    />
               </div>

               <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton}>
                         Save Changes
                    </button>
                    <button
                         type="button"
                         onClick={onCancel}
                         className={styles.cancelButton}
                    >
                         Cancel
                    </button>
               </div>
          </form>
     );
} 