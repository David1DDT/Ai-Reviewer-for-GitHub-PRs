import { ReactNode } from "react";

export default function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition text-center">
            <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-2 text-black">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
