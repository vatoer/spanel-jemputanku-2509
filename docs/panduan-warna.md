# 🎨 Panduan Warna - Jemputanku Dashboard

## 🎯 **Brand Identity & Color Philosophy**

Jemputanku menggunakan skema warna yang mencerminkan profesionalisme, kepercayaan, dan kemudahan dalam transportasi publik. Desain mengutamakan kontras yang baik, accessibility, dan konsistensi visual.

---

## 🔵 **Primary Colors (Warna Utama)**

### **Blue Primary - #3B82F6**
```css
/* Tailwind: bg-blue-500, text-blue-500 */
--primary-blue: #3B82F6;
--primary-blue-50: #EFF6FF;   /* bg-blue-50 */
--primary-blue-100: #DBEAFE;  /* bg-blue-100 */
--primary-blue-600: #2563EB;  /* bg-blue-600 */
--primary-blue-700: #1D4ED8;  /* bg-blue-700 */
--primary-blue-900: #1E3A8A;  /* bg-blue-900 */
```

**Penggunaan:**
- ✅ Primary buttons & CTA
- ✅ Active navigation states
- ✅ Brand elements & logos
- ✅ Links & interactive elements
- ✅ Progress indicators

**Contoh Implementasi:**
```tsx
// Primary Button
className="bg-blue-500 hover:bg-blue-600 text-white"

// Active Navigation
className="bg-blue-100 text-blue-700 border-l-4 border-blue-500"

// Interactive Elements
className="text-blue-600 hover:text-blue-700"
```

---

## 🟢 **Success & Status Colors**

### **Green Success - #10B981**
```css
/* Tailwind: bg-emerald-500, text-emerald-500 */
--success-green: #10B981;
--success-green-50: #ECFDF5;   /* bg-emerald-50 */
--success-green-100: #D1FAE5;  /* bg-emerald-100 */
--success-green-600: #059669;  /* bg-emerald-600 */
--success-green-700: #047857;  /* bg-emerald-700 */
```

**Penggunaan:**
- ✅ Success messages & notifications
- ✅ Active/operational status indicators
- ✅ Completed actions
- ✅ Available/online status
- ✅ Positive metrics & growth

**Contoh Implementasi:**
```tsx
// Success Badge
className="bg-emerald-100 text-emerald-700 border border-emerald-200"

// Active Vehicle Status
className="bg-emerald-500 text-white"

// Success Alert
className="bg-emerald-50 border-emerald-200 text-emerald-800"
```

---

## 🟡 **Warning & Attention Colors**

### **Yellow/Amber Warning - #F59E0B**
```css
/* Tailwind: bg-amber-500, text-amber-500 */
--warning-amber: #F59E0B;
--warning-amber-50: #FFFBEB;   /* bg-amber-50 */
--warning-amber-100: #FEF3C7;  /* bg-amber-100 */
--warning-amber-600: #D97706;  /* bg-amber-600 */
--warning-amber-700: #B45309;  /* bg-amber-700 */
```

**Penggunaan:**
- ⚠️ Warning messages & alerts
- ⚠️ Idle/standby status
- ⚠️ Attention-needed states
- ⚠️ Pending actions
- ⚠️ Caution indicators

**Contoh Implementasi:**
```tsx
// Warning Badge
className="bg-amber-100 text-amber-700 border border-amber-200"

// Idle Status
className="bg-amber-500 text-white"

// Warning Alert
className="bg-amber-50 border-amber-200 text-amber-800"
```

---

## 🔴 **Error & Critical Colors**

### **Red Error - #EF4444**
```css
/* Tailwind: bg-red-500, text-red-500 */
--error-red: #EF4444;
--error-red-50: #FEF2F2;     /* bg-red-50 */
--error-red-100: #FEE2E2;    /* bg-red-100 */
--error-red-600: #DC2626;    /* bg-red-600 */
--error-red-700: #B91C1C;    /* bg-red-700 */
```

**Penggunaan:**
- ❌ Error messages & alerts
- ❌ Critical system status
- ❌ Maintenance/offline status
- ❌ Destructive actions
- ❌ Failed operations

**Contoh Implementasi:**
```tsx
// Error Badge
className="bg-red-100 text-red-700 border border-red-200"

// Maintenance Status
className="bg-red-500 text-white"

// Delete Button
className="bg-red-600 hover:bg-red-700 text-white"
```

---

## ⚫ **Neutral Colors (Gray Scale)**

### **Gray Palette**
```css
/* Tailwind Gray Scale */
--gray-50: #F9FAFB;    /* Backgrounds, subtle fills */
--gray-100: #F3F4F6;   /* Light backgrounds, disabled states */
--gray-200: #E5E7EB;   /* Borders, dividers */
--gray-300: #D1D5DB;   /* Input borders, inactive elements */
--gray-400: #9CA3AF;   /* Placeholder text, disabled icons */
--gray-500: #6B7280;   /* Secondary text, helper text */
--gray-600: #4B5563;   /* Primary text, body copy */
--gray-700: #374151;   /* Headings, important text */
--gray-800: #1F2937;   /* Strong headings, emphasis */
--gray-900: #111827;   /* Maximum contrast text */
```

**Penggunaan Berdasarkan Tingkat:**
```tsx
// Background Levels
"bg-gray-50"     // Page backgrounds
"bg-gray-100"    // Card backgrounds, subtle emphasis
"bg-gray-200"    // Disabled states, dividers

// Border Levels  
"border-gray-200" // Default borders
"border-gray-300" // Input borders, active borders
"border-gray-400" // Emphasis borders

// Text Levels
"text-gray-900"   // Primary headings
"text-gray-700"   // Secondary headings
"text-gray-600"   // Body text
"text-gray-500"   // Helper text, labels
"text-gray-400"   // Placeholder, disabled text
```

---

## 🎨 **Component-Specific Color Schemes**

### **1. Navigation & Sidebar**
```tsx
// Sidebar Container
className="bg-white border-r border-gray-200 shadow-sm"

// Brand/Logo Area
className="bg-gradient-to-r from-blue-600 to-blue-700 text-white"

// Navigation Items - Default
className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"

// Navigation Items - Active
className="bg-blue-50 text-blue-700 border-r-4 border-blue-500"

// Navigation Icons
className="text-gray-400 group-hover:text-gray-600"
```

### **2. Headers & Titles**
```tsx
// Page Headers
className="text-2xl font-bold text-gray-900"

// Section Headers  
className="text-lg font-semibold text-gray-800"

// Card Headers
className="text-base font-medium text-gray-700"

// Subheadings
className="text-sm font-medium text-gray-600"
```

### **3. Cards & Containers**
```tsx
// Primary Cards
className="bg-white rounded-lg shadow-sm border border-gray-200"

// Interactive Cards
className="bg-white hover:shadow-md border-2 border-gray-200 hover:border-blue-300"

// Selected Cards
className="bg-blue-50 border-2 border-blue-500 shadow-lg"

// Header Areas
className="bg-gray-50 border-b border-gray-200"
```

### **4. Buttons & Actions**
```tsx
// Primary Buttons
className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white"

// Secondary Buttons  
className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"

// Danger Buttons
className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"

// Success Buttons
className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"

// Ghost/Text Buttons
className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
```

### **5. Status Indicators & Badges**
```tsx
// Active/Online
className="bg-emerald-100 text-emerald-700 border border-emerald-200"

// Idle/Standby
className="bg-amber-100 text-amber-700 border border-amber-200"

// Maintenance/Error
className="bg-red-100 text-red-700 border border-red-200"

// Info/Neutral
className="bg-blue-100 text-blue-700 border border-blue-200"

// Count Badges
className="bg-blue-600 text-white text-xs font-medium"
```

### **6. Form Elements**
```tsx
// Input Fields
className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"

// Labels
className="text-sm font-medium text-gray-700"

// Helper Text
className="text-xs text-gray-500"

// Error States
className="border-red-300 focus:border-red-500 focus:ring-red-500"

// Success States  
className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
```

---

## 📐 **Layout & Spacing Guidelines**

### **Container Backgrounds**
```tsx
// App Background
className="bg-gray-50"

// Main Content Areas
className="bg-white"

// Sidebar/Navigation  
className="bg-white shadow-sm"

// Headers/Toolbars
className="bg-white border-b border-gray-200"
```

### **Shadow Hierarchy**
```tsx
// Subtle Depth
className="shadow-sm"        // Cards, minor elevation

// Standard Depth  
className="shadow"           // Modals, dropdowns

// Prominent Depth
className="shadow-lg"        // Selected states, overlays

// Maximum Depth
className="shadow-2xl"       // Modals, notifications
```

---

## 🔧 **Implementation Rules for AI Agents**

### **DO's ✅**
1. **Consistency First**: Always use defined color tokens
2. **Proper Contrast**: Ensure WCAG AA compliance (4.5:1 minimum)
3. **Semantic Colors**: Use colors that match their meaning (red=error, green=success)
4. **Progressive Enhancement**: Start with neutral grays, add accent colors purposefully
5. **Status Clarity**: Make status immediately recognizable through color

### **DON'Ts ❌**
1. **Never use arbitrary colors** outside this palette
2. **Don't mix warm/cool grays** - stick to Tailwind's gray scale
3. **Avoid color-only communication** - always pair with icons/text
4. **Don't use bright colors** for large areas
5. **Never sacrifice readability** for visual appeal

### **Quick Reference Patterns**
```tsx
// Navigation Active State
"bg-blue-50 text-blue-700 border-r-4 border-blue-500"

// Status Badge Pattern
"px-2 py-1 rounded-full text-xs font-medium bg-{color}-100 text-{color}-700"

// Interactive Card Pattern
"bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"

// Button Primary Pattern
"bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
```

---

## 🎯 **Brand Personality Through Color**

- **Professional**: Clean whites, structured grays
- **Trustworthy**: Consistent blues, reliable patterns  
- **Efficient**: Clear status colors, immediate recognition
- **Modern**: Subtle gradients, contemporary shadows
- **Accessible**: High contrast, clear hierarchies

---

## 📱 **Responsive Color Considerations**

- **Mobile**: Larger touch targets with consistent colors
- **Desktop**: Subtle hover states and focus indicators
- **Dark Mode Ready**: All colors have corresponding dark variants available
- **High Contrast**: Alternative palette for accessibility needs

---

*Terakhir diperbarui: September 24, 2025*
*Untuk pertanyaan atau perubahan, konsultasikan dengan design system team*