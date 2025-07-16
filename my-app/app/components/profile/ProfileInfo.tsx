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
          <div className={styles.profileInfo}>
               <div className={styles.infoGroup}>
                    <h3>Name</h3>
                    <p>{profile.name}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Email</h3>
                    <p>{profile.email}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Address</h3>
                    <p>{profile.address || 'Not provided'}</p>
               </div>

               <div className={styles.infoGroup}>
                    <h3>Phone</h3>
                    <p>{profile.phone || 'Not provided'}</p>
               </div>

               <button
                    onClick={onEdit}
                    className={styles.editButton}
               >
                    Edit Profile
               </button>
          </div>
     );
} 