import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                
                <div className="prose prose-lg text-gray-600 space-y-6">
                    <p>Last updated: January 12, 2026</p>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing our website and using our services, you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not access the service.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Intellectual Property Rights</h2>
                    <p>
                        Other than the content you own, under these Terms, Brickosys and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Restrictions</h2>
                    <p>
                        You are specifically restricted from all of the following:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>publishing any Website material in any other media;</li>
                        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>publicly performing and/or showing any Website material;</li>
                        <li>using this Website in any way that is or may be damaging to this Website;</li>
                        <li>using this Website in any way that impacts user access to this Website;</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. No Warranties</h2>
                    <p>
                        This Website is provided "as is," with all faults, and Brickosys express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p>
                        In no event shall Brickosys, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Brickosys, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">6. Contact Information</h2>
                    <p>
                        Questions about the Terms of Service should be sent to us at <a href="mailto:support@brickosys.com" className="text-blue-600 hover:text-blue-800">support@brickosys.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
