import DashboardAdmin from './components/dashboard-admin';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { isAdmin, isTeacher, isStudent } = useAuth();

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Role-based Dashboard Components */}
            {isAdmin && <DashboardAdmin />}
        </div>
    );
};

export default Dashboard;