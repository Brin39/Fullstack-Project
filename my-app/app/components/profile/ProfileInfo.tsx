import styles from './Profile.module.css';

interface UserProfile {
     _id: string;
     name: string;
     email: string;
     address?: string;
     phone?: string;
}

interface ProfileInfoProps {
     profile: UserProfile;
     onEdit: () => void;
}

export default function ProfileInfo({ profile, onEdit }: ProfileInfoProps) {
     return (
          <div className={styles.profileInfo} data-testid="profile-info">
               <div className={styles.infoGroup}>
                    <h3>Name</h3>
                    <p data-testid="profile-name">{profile.name}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Email</h3>
                    <p data-testid="profile-email">{profile.email}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Address</h3>
                    <p data-testid="profile-address">{profile.address || 'Not provided'}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Phone</h3>
                    <p data-testid="profile-phone">{profile.phone || 'Not provided'}</p>
               </div>

               <button
                    onClick={onEdit}
                    className={styles.editButton}
                    data-testid="profile-edit-btn"
               >
                    Edit Profile
               </button>
          </div>
     );
} 