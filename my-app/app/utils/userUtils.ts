import { User } from '@/app/hooks/useUsers';

// קבלת צבע תפקיד משתמש
export const getRoleColor = (role: string): string => {
     switch (role.toLowerCase()) {
          case 'admin':
               return '#DC2626'; // red-600
          case 'user':
               return '#059669'; // green-600
          case 'moderator':
               return '#7C3AED'; // violet-600
          default:
               return '#6B7280'; // gray-500
     }
};

// קבלת טקסט תפקיד
export const getRoleText = (role: string): string => {
     switch (role.toLowerCase()) {
          case 'admin':
               return 'Admin';
          case 'user':
               return 'User';
          case 'moderator':
               return 'Moderator';
          default:
               return role;
     }
};

// עיצוב תאריך יצירת משתמש
export const formatUserDate = (dateString: string): string => {
     const date = new Date(dateString);
     return date.toLocaleDateString('he-IL', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
     });
};

// קבלת מקודדי המשתמש
export const getUserInitials = (name: string): string => {
     const names = name.split(' ');
     if (names.length >= 2) {
          return `${names[0][0]}${names[1][0]}`.toUpperCase();
     }
     return name[0]?.toUpperCase() || '?';
};

// בדיקת ניתן למחוק משתמש
export const canDeleteUser = (user: User, currentUser?: User): boolean => {
     // לא ניתן למחוק את עצמך
     if (currentUser && user._id === currentUser._id) {
          return false;
     }

     // לא ניתן למחוק מנהל אחר
     if (user.role === 'admin' && currentUser?.role !== 'admin') {
          return false;
     }

     return true;
};

// קבלת סטטוס פעילות המשתמש
export const getUserStatus = (user: User): { text: string; color: string } => {
     const now = new Date();
     const lastActivity = user.updatedAt ? new Date(user.updatedAt) : new Date(user.createdAt || '');
     const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

     if (daysSinceActivity < 1) {
          return { text: 'Active', color: '#059669' };
     } else if (daysSinceActivity < 7) {
          return { text: 'Recently Active', color: '#D97706' };
     } else {
          return { text: 'Inactive', color: '#6B7280' };
     }
}; 