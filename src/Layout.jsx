import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

return (
    <div className="min-h-screen flex flex-col max-w-full">
      {/* Header */}
      <header className="sticky top-0 flex-shrink-0 h-16 bg-white border-b border-gray-200 z-40">
        <div className="h-full px-4 flex items-center justify-between max-w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold font-display text-gray-900 hidden sm:block">TaskFlow</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {Object.values(routes).map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={route.icon} size={18} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-16 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
            >
              <nav className="p-4 space-y-2">
                {Object.values(routes).map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={20} />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

{/* Main Content */}
      <main className="flex-1 min-h-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;