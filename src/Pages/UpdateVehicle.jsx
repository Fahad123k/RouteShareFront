import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VehicleUpdatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const BACKEND_API = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        make: '',
        model: '',
        licensePlate: '',
        capacity: '',
        type: 'car'
    });

    const [initialData, setInitialData] = useState(null);

    const vehicleTypes = [
        'car', 'bike', 'truck', 'van', 'bus', 'scooter', 'other'
    ];

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${BACKEND_API}/user/vehicle/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                const data = response.data || {};
                setInitialData(data);
                setFormData({
                    make: data.make || '',
                    model: data.model || '',
                    licensePlate: data.licensePlate || '',
                    capacity: data.capacity || '',
                    type: data.type || 'car'
                });
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load vehicle details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVehicleDetails();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {};
            for (const key in formData) {
                if (initialData && formData[key] !== initialData[key]) {
                    payload[key] = formData[key];
                }
            }

            if (Object.keys(payload).length === 0 && initialData) {
                setSuccess(true);
                setTimeout(() => navigate('/vehicles'), 1000);
                return;
            }

            await axios.patch(
                `${BACKEND_API}/user/vehicle/${id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSuccess(true);
            setTimeout(() => navigate('/vehicles'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to update vehicle');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !initialData) {
        return <div className="p-4">Loading vehicle details...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Update Vehicle</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {initialData ? "Vehicle updated successfully! Redirecting..." : "No changes detected. Redirecting..."}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                    <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (kg)</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {vehicleTypes.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/vehicles')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Vehicle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleUpdatePage;
