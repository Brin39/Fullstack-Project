# Hooks - הוקים כלליים של האפליקציה

## 📁 מבנה

```
app/hooks/
├── useAuth.ts      # אימות והרשאה
├── useApi.ts       # פונקציות API כלליות
├── useForm.ts      # ניהול טפסים
├── useCart.ts      # ניהול עגלת קניות
├── useProducts.ts  # ניהול מוצרים (מנהל)
└── useOrders.ts    # ניהול הזמנות (מנהל)
```

## 🔧 תיאור ההוקים

### `useAuth`
הוק כללי לאימות בכל האפליקציה.

```typescript
const { getAuthHeaders, handleAuthError, checkAuth } = useAuth();
```

**פונקציות:**
- `getAuthHeaders()` - קבלת כותרות עם טוקן
- `handleAuthError(response)` - טיפול בשגיאות 401
- `checkAuth()` - בדיקת נוכחות טוקן

### `useApi`
הוק כללי לבקשות API עם אימות אוטומטי.

```typescript
const { get, post, put, del } = useApi();
```

**מתודות:**
- `get(url)` - בקשת GET
- `post(url, data)` - בקשת POST
- `put(url, data)` - בקשת PUT
- `del(url)` - בקשת DELETE

### `useForm`
הוק כללי לניהול טפסים עם ולידציה וטיפול בשגיאות.

```typescript
const {
  formData,
  loading,
  error,
  handleInputChange,
  handleSubmit,
  resetForm,
  updateFormData
} = useForm({
  initialData,
  onSubmit,
  onSuccess,
  onError
});
```

**פונקציות:**
- `handleInputChange(e)` - טיפול בשינויי קלט
- `handleSubmit(e)` - שליחת הטופס
- `resetForm()` - איפוס הטופס
- `updateFormData(data)` - עדכון נתוני הטופס

### `useProducts`
הוק לניהול מוצרים בלוח המנהל.

```typescript
const {
  products,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleSaveProduct,
  handleCreateProduct
} = useProducts();
```

### `useOrders`
הוק לניהול הזמנות בלוח המנהל.

```typescript
const {
  orders,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  handleUpdateStatus,
  handleDeleteOrder
} = useOrders();
```

### `useCart`
הוק לניהול עגלת קניות.

## 🎯 יתרונות

1. **נקודת אימות מאוחדת** - כל בקשות ה-API משתמשות בהוק אחד
2. **טיפול אוטומטי בשגיאות** - שגיאות 401 מטופלות באופן מרכזי
3. **ניהול טפסים מאוחד** - שימוש חוזר בלוגיקת טפסים
4. **שימוש חוזר** - הוקים ניתן להשתמש בכל קומפוננט 