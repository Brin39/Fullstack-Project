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
          <form onSubmit={handleSubmit} className={styles.form} data-testid="profile-form">
               <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name || ''}
                         onChange={handleInputChange}
                         required
                         data-testid="profile-name-input"
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
                         data-testid="profile-email-input"
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
                         data-testid="profile-address-input"
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
                         data-testid="profile-phone-input"
                    />
               </div>

               <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveButton} data-testid="profile-save-btn">
                         Save Changes
                    </button>
                    <button
                         type="button"
                         onClick={onCancel}
                         className={styles.cancelButton}
                         data-testid="profile-cancel-btn"
                    >
                         Cancel
                    </button>
               </div>
          </form>
     );
} 