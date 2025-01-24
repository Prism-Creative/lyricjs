export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  return formData;
}
