import api from '../config/axios';

function useDevice() {
  async function createDevice(data: any) {
    const response = await api.post('/devices/', data);
    return response.data;
  }

  async function updateDevice(data: any, id: string) {
    const response = await api.put(`/devices/${id}`, data);
    return response.data;
  }

  async function deleteDevice(id: string) {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  }

  async function getAll() {
    const response = await api.get('/devices');
    if (response) return response.data;
  }

  return {
    createDevice,
    updateDevice,
    deleteDevice,
    getAll,
  };
}

export default useDevice;
