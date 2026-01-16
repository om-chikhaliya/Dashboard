import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from './helper/SidebarContext';

const Footer = () => {
    // Theme color - lime green
    // const themeColor = "rgb(212, 255, 31)";
    const location = useLocation();
    const { isSidebarOpen } = useSidebar();
    
    // List of routes that DO NOT have a sidebar
    const noSidebarRoutes = ['/', '/login', '/signup', '/addkeys'];
    
    // Check if the current route should have a sidebar
    const hasSidebar = !noSidebarRoutes.includes(location.pathname);
    
    // Only add padding if usage has sidebar AND sidebar is open
    const shouldAddPadding = hasSidebar && isSidebarOpen;

    return (
        <footer className={`py-12 bg-gray-50 border-t border-gray-200 transition-all duration-300 ${shouldAddPadding ? 'lg:pl-[240px]' : ''}`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-3 mb-6 md:mb-0 cursor-pointer">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                        // style={{ backgroundColor: themeColor }}
                        >
                            <img src="/assets/Brickosys.png" alt="" className="h-8 w-8" />
                            {/* <Package className="h-4 w-4 text-gray-800" /> */}
                        </div>
                        <span className="font-bold text-xl">Brickosys</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
                        {/* <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Discord
                        </a> */}
                        <a href="mailto:support@brickosys.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Contact
                        </a>
                        <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Privacy
                        </a>
                        <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Terms
                        </a>
                        <a href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Help
                        </a>
                    </div>

                    <div className="text-gray-600 text-sm text-center">
                        <p>© Brickosys Limited. All rights reserved.</p>
                        <p className="text-xs mt-1">
                            LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this
                            site.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
