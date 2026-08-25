import { useLocation, Link } from "react-router-dom";
import { Fragment } from "react";
import { List } from "@phosphor-icons/react";

import whiteLogo from "../assets/white-logo.svg";

const Header = ({ onMenuClick }) => {
    const location = useLocation();

    const getBreadCrumbs = () => {
        const path = location.pathname;

        const crumbs = [{ label: "Menu", path: "/dashboard" }];

        if (path.includes("/dashboard")) {
            crumbs.push({ label: "Dashboard" });
        } else if (path.includes('/users')) {
            crumbs.push({ label: 'Kelola Pengguna', path: '/users'});
            if (path.includes('/create')) crumbs.push({ label: 'Tambah Pengguna'});
            if (path.includes('/edit')) crumbs.push({ label: 'Edit Pengguna'});
        } else if (path.includes('/courses')) {
            crumbs.push({ label: 'Kelola Kursus', path: '/courses' });
            if (path.includes('/create')) crumbs.push({ label: 'Tambah Kursus' });
            if (path.includes('/edit')) crumbs.push({ label: 'Edit Pengguna' });
        } else if (path.includes('/exams')) {
            crumbs.push({ label: 'Manajemen Ujian', path: '/exams' });
            if (path.includes('/create')) crumbs.push({ label: 'Tambah Ujian' });
            if (path.includes('/edit')) crumbs.push({ label: 'Edit Ujian' });
            if (path.includes('/questions')) crumbs.push({ label: 'Kelola Soal' });
        } else if (path.includes('/question-bank')) {
            crumbs.push({ label: 'Bank Soal', path: '/question-bank' });
            const courseIdMatch = path.match(/\/question-bank\/course\/(\id+)/);
            if (courseIdMatch) {
                crumbs.push({ label: 'Kelola Soal', path: `/question-bank/course/${courseIdMatch[1]}`});
            }
            if (path.includes('/create')) crumbs.push({ label: 'Tambah Soal' });
            if (path.includes('/edit')) crumbs.push({ label: 'Edit Soal' });
        }
        return crumbs;
    };

    const breadcrumbs = getBreadCrumbs();
    const currentLabel = breadcrumbs[breadcrumbs.length - 1]?.label;

    return (
        <header className="w-full">
            <div className="w-full bg-[#465FFF] h-14 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-indigo-100/50">

                <div className="lg:hidden flex items-center gap-3">
                    <img
                        src={whiteLogo}
                        alt="Logo"
                        className="w-7 h-7 object-contain"
                    />

                    <span className="text-white font-semibold text-sm tracking-wide">
                        {currentLabel}
                    </span>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-white/80 text-[14px] font-normal">
                    {breadcrumbs.map((crumb, idx) => (
                        <Fragment key={idx}>
                            {idx > 0 && (
                                <span className="opacity-50 text-white/60">/</span>
                            )}

                            <span
                                className={`tracking-wider ${idx === breadcrumbs.length - 1
                                        ? "text-white font-medium"
                                        : "hover:text-white cursor-pointer transition-colors"
                                    }`}
                            >
                                <Link to={crumb.path}>{crumb.label}</Link>
                            </span>
                        </Fragment>
                    ))}
                </div>

                <button
                    onClick={onMenuClick}
                    className="lg:hidden cursor-pointer p-2 -mr-2 text-white/80 hover:text-white transition-colors ml-auto"
                    aria-label="Toggle Menu"
                >
                    <List size={24} weight="bold" />
                </button>
            </div>
        </header>
    );
};

export default Header;