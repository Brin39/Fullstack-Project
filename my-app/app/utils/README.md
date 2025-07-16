# Utils - כלים כלליים של האפליקציה

## 📁 מבנה

```
app/utils/
├── commonUtils.ts   # כלים כלליים
├── orderUtils.ts    # כלים להזמנות
└── productUtils.ts  # כלים למוצרים (קובץ עתידי)
```

## 🔧 תיאור הכלים

### `commonUtils.ts`
כלים כלליים לכל האפליקציה.

**פונקציות:**
- `formatDate(date)` - עיצוב תאריך
- `formatPrice(price)` - עיצוב מחיר
- `truncateText(text, maxLength)` - קיצור טקסט
- `generateId()` - יצירת מזהה ייחודי
- `isValidEmail(email)` - אימות אימייל
- `isValidPassword(password)` - אימות סיסמה
- `debounce(func, delay)` - פונקציית debounce

### `orderUtils.ts`
כלים לעבודה עם הזמנות.

**פונקציות:**
- `getStatusColor(status)` - קבלת צבע סטטוס
- `getStatusTransitions()` - קבלת מעברי סטטוסים
- `canUpdateStatus(status)` - בדיקת אפשרות עדכון סטטוס

**טיפוסים:**
- `OrderStatus` - טיפוס סטטוס הזמנה

## 🎯 יתרונות

1. **ריכוז** - כל הכלים במקום אחד
2. **שימוש חוזר** - פונקציות ניתן להשתמש בכל מקום
3. **עקביות** - גישה מאוחדת לעיצוב
4. **טיפוסים** - תמיכה מלאה ב-TypeScript
5. **בדיקות** - כלים קלים לבדיקה

## 📝 דוגמאות שימוש

```typescript
import { formatDate, formatPrice, getStatusColor } from '@/app/utils';

// עיצוב
const date = formatDate('2024-01-15'); // "1/15/2024"
const price = formatPrice(99.99); // "$99.99"

// סטטוסי הזמנות
const color = getStatusColor('pending'); // "#F59E0B"
``` 