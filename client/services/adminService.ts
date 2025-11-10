import API from "../lib/api";


interface ChangePasswordResponse {
  message: string;
}

export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  const res = await API.put<ChangePasswordResponse>("/admin/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};