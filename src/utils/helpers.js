/**
 * Helper Utilities for EvoDoc Portal
 * - Date formatting and manipulation
 * - Validation functions
 * - Data formatting utilities
 */

// ===== DATE UTILITIES =====
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  return `${formatDate(dateStr)} at ${timeStr}`;
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateForInput = (dateStr) => {
  // Convert from YYYY-MM-DD to ISO format for input[type="date"]
  return dateStr;
};

export const getDateFromInput = (inputValue) => {
  // Convert from input[type="date"] to YYYY-MM-DD
  return inputValue;
};

export const calculateAge = (dob) => {
  if (!dob) return 0;
  const today = new Date();
  const birthDate = new Date(dob + 'T00:00:00');
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getToday = () => new Date().toISOString().split('T')[0];

export const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

export const getNextWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

export const isToday = (dateStr) => dateStr === getToday();

export const isFuture = (dateStr) => dateStr > getToday();

export const isPast = (dateStr) => dateStr < getToday();

export const isDateRange = (startDate, endDate) => {
  return (date) => date >= startDate && date <= endDate;
};

// ===== VALIDATION UTILITIES =====
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  // Extract strictly digits
  const cleaned = phone.replace(/\D/g, '');
  // Enforce exactly 10 digits
  return cleaned.length === 10;
};

export const validateRequired = (value) => {
  return value && String(value).trim().length > 0;
};

export const validateNameFormat = (name) => {
  return name && name.trim().split(' ').length >= 2;
};

// ===== FORMATTING UTILITIES =====
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format as +91 XXXXX XXXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 10) return phone;
  return `+91 ${cleaned.slice(-10, -5)} ${cleaned.slice(-5)}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const capitalizeFirstLetter = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
};

export const toTitleCase = (str) => {
  return str
    ?.split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ') || '';
};

// ===== FILTERING & SEARCHING =====
export const filterByStatus = (items, status) => {
  return items.filter(item => item.status === status);
};

export const filterByDate = (items, date) => {
  return items.filter(item => item.date === date);
};

export const searchInArray = (items, query, searchKeys = ['name']) => {
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    searchKeys.some(key =>
      item[key]?.toString().toLowerCase().includes(lowerQuery)
    )
  );
};

export const sortByDate = (items, descending = false) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return descending ? dateB - dateA : dateA - dateB;
  });
};

// ===== APPOINTMENT UTILITIES =====
export const getAppointmentStatusColor = (status) => {
  const colors = {
    scheduled: '#3b82f6',
    completed: '#10b981',
    cancelled: '#ef4444',
    pending: '#f59e0b'
  };
  return colors[status] || '#94a3b8';
};

export const getAppointmentStatusLabel = (status) => {
  const labels = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending: 'Pending'
  };
  return labels[status] || status;
};

// ===== LOCAL STORAGE HELPERS =====
export const saveToDraft = (key, data) => {
  try {
    localStorage.setItem(`draft_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save draft', e);
  }
};

export const loadFromDraft = (key) => {
  try {
    const data = localStorage.getItem(`draft_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load draft', e);
    return null;
  }
};

export const clearDraft = (key) => {
  try {
    localStorage.removeItem(`draft_${key}`);
  } catch (e) {
    console.error('Failed to clear draft', e);
  }
};

// ===== FILE & EXPORT HELPERS =====
export const downloadAsJSON = (data, filename = 'data.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = filename;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportToCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const cell = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(cell || '').replace(/"/g, '""');
        return /,|"|\n/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');

  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = filename;
  link.click();
};

// ===== MOCK DATA GENERATORS =====
export const generateMockId = () => Date.now();

export const generateMockDoctorSlots = () => {
  const slots = [];
  for (let h = 9; h < 17; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};
