// hooks/useIsAdmin.js
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const useIsAdmin = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAdmin(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setIsAdmin(decoded.role === 'admin');
        } catch (error) {
            console.error("Token decode error", error);
            setIsAdmin(false);
        }
    }, []);
    // console.log('is admins', isAdmin)

    return isAdmin;
};

export default useIsAdmin;
